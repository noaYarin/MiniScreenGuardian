import { AppError } from "../utils/appError.js";
import { Common as CommonErrors, Request as RequestErrors } from "../constants/errors.js";
import { RequestStatus } from "../constants/status.js";
import * as requestDal from "../dal/request.dal.js";
import { assertValidObjectId } from "../utils/validators.js";
import { NotificationSeverity } from "../constants/severity.js";
import { NotificationType } from "../constants/notificationType.js";
import { notifyParent, notifyChild } from "../services/notification.service.js";
import { addExtraMinutesToDevice, findDeviceById } from "../dal/device.dal.js";
import { sendAuditLog } from "./audit.service.js";
import { AuditActionType } from "../constants/auditActionType.js";
import { validateDeviceAccess, pushPolicyUpdate, pushDeviceStatusUpdate } from "./device.service.js";
import { getChildrenByParentId } from "../dal/parent.dal.js";

const MIN_MINUTES = 1;
const MAX_MINUTES = 120;

function assertMinutes(minutes) {
    const n = Number(minutes);
    if (!Number.isFinite(n) || n < MIN_MINUTES || n > MAX_MINUTES) {
        throw new AppError(RequestErrors.INVALID_MINUTES);
    }
    return n;
}


function ensureChildBelongsToParent(childList, childId) {
    const child = childList.find((c) => String(c._id) === String(childId));

    if (!child) {
        throw new AppError(CommonErrors.CHILD_NOT_FOUND);
    }

    return child;
}

function assertDecision(decision) {
    if (
        decision !== RequestStatus.APPROVED &&
        decision !== RequestStatus.REJECTED
    ) {
        throw new AppError(RequestErrors.INVALID_DECISION);
    }
}


export async function createRequest({ parentId, childId, deviceId, requestedMinutes, reason }) {

    assertValidObjectId(parentId, CommonErrors.INVALID_PARENT_ID);
    assertValidObjectId(childId, CommonErrors.INVALID_CHILD_ID);
    assertValidObjectId(deviceId, CommonErrors.INVALID_DEVICE_ID);

    const minutes = assertMinutes(requestedMinutes);

    await validateDeviceAccess({ deviceId, parentId, childId });

    // check duplicate pending request
    const existingPending = await requestDal.findPendingRequestForDevice({
        parentId,
        childId,
        deviceId
    });

    if (existingPending) {
        throw new AppError(RequestErrors.REQUEST_ALREADY_PENDING);
    }

    const request = await requestDal.createRequestDoc({
        parentId,
        childId,
        deviceId,
        requestedMinutes: minutes,
        reason: reason ?? "",
        status: RequestStatus.PENDING
    });


    try {
        await notifyParent({
            parentId,
            childId,
            type: NotificationType.EXTENSION_REQUEST_CREATED,
            severity: NotificationSeverity.INFO,
            title: "New Extension Request",
            description: "Your child requested more screen time"
        });
    } catch (err) {
        console.error("notifyParent failed in createRequest:", err.message);
    }

    return request;
}

export async function getChildRequests({ parentId, childId, status }) {

    assertValidObjectId(parentId, CommonErrors.INVALID_PARENT_ID);
    assertValidObjectId(childId, CommonErrors.INVALID_CHILD_ID);

    if (status) {
        const allowed = new Set(Object.values(RequestStatus));
        if (!allowed.has(status)) {
            throw new AppError(RequestErrors.INVALID_REQUEST_STATUS);
        }
    }

    return requestDal.findRequestsByChild({
        parentId,
        childId,
        status
    });
}

export async function getPendingRequests({ parentId, childId }) {
    assertValidObjectId(parentId, CommonErrors.INVALID_PARENT_ID);

    if (childId) {
        assertValidObjectId(childId, CommonErrors.INVALID_CHILD_ID);

        const childList = await getChildrenByParentId(parentId);
        ensureChildBelongsToParent(childList, childId);
    }

    return requestDal.findPendingRequestsByParent({
        parentId,
        childId
    });
}

export async function decideRequest({ parentId, requestId, decision }) {

    assertValidObjectId(parentId, CommonErrors.INVALID_PARENT_ID);
    assertValidObjectId(requestId, RequestErrors.INVALID_REQUEST_ID);

    assertDecision(decision);

    //update only if still pending
    const updated = await requestDal.updateRequestDecisionIfPending({
        requestId,
        parentId,
        decision
    });

    if (updated) {
        if (decision === RequestStatus.APPROVED) {
            await addExtraMinutesToDevice(
                updated.deviceId,
                Number(updated.requestedMinutes || 0)
            );

            const updatedDevice = await findDeviceById(updated.deviceId);

            // Push the updated policy to the child device in real time after approval
            pushPolicyUpdate(updatedDevice);

            // Push the latest device status to the parent room in real time
            pushDeviceStatusUpdate(updatedDevice);

        }
        try {
            await notifyChild({
                parentId: updated.parentId,
                childId: updated.childId,
                type: decision === RequestStatus.APPROVED
                    ? NotificationType.EXTENSION_REQUEST_APPROVED
                    : NotificationType.EXTENSION_REQUEST_REJECTED,
                severity: NotificationSeverity.INFO,
                title: decision === RequestStatus.APPROVED
                    ? "Extension Request Approved"
                    : "Extension Request Rejected",
                description: decision === RequestStatus.APPROVED
                    ? "Your parent approved your extension request"
                    : "Your parent rejected your extension request"
            });
        } catch (err) {
            console.error("notifyChild failed in decideRequest:", err.message);
        }

        try {
            await sendAuditLog({
                parentId: updated.parentId,
                childId: updated.childId,
                actionType: decision === RequestStatus.APPROVED
                    ? AuditActionType.APPROVE_REQUEST
                    : AuditActionType.REJECT_REQUEST,
            });
        } catch (err) {
            console.error("sendAuditLog failed in decideRequest:", err.message);
        }

        return updated;
    }
    // If not updated- then why
    const existing = await requestDal.findRequestByIdForParent({ requestId, parentId });

    if (!existing) {
        throw new AppError(RequestErrors.REQUEST_NOT_FOUND);
    }

    // request exist but not pending
    throw new AppError(RequestErrors.REQUEST_NOT_PENDING);

}