import RequestModel from "../models/request.model.js";
import { RequestStatus } from "../constants/status.js";


// Create
export async function createRequestDoc(data) {
    return RequestModel.create(data);
}

// Read: child requests (optionally by status)
export async function findRequestsByChild({ parentId, childId, status }) {
    const filter = { parentId, childId };
    if (status) filter.status = status;

    return RequestModel.find(filter).sort({ createdAt: -1 }).lean();
}

// Read: pending for parent (optionally filter by child)
export async function findPendingRequestsByParent({ parentId, childId }) {
    const filter = { parentId, status: RequestStatus.PENDING };
    if (childId) filter.childId = childId;

    return RequestModel.find(filter).sort({ createdAt: -1 }).lean();
}

// Read: single request that belongs to parent (for decision)
export async function findRequestByIdForParent({ requestId, parentId }) {
    return RequestModel.findOne({ _id: requestId, parentId }).lean();
}

// Update: set decision 
export async function updateRequestDecisionIfPending({ requestId, parentId, decision }) {
    return RequestModel.findOneAndUpdate(
        { _id: requestId, parentId, status: RequestStatus.PENDING },
        { $set: { status: decision } },
        { new: true }
    );
}

// check duplicate pending request for same device
export async function findPendingRequestForDevice({ parentId, childId, deviceId }) {
    return RequestModel.findOne({
        parentId,
        childId,
        deviceId,
        status: RequestStatus.PENDING,
    }).lean();
}