import { AppError } from "../utils/appError.js";
import { Common as CommonErrors } from "../constants/errors.js";
import { getChildrenByParentId } from "../dal/parent.dal.js";
import { findRequestsByChild } from "../dal/request.dal.js";
import { findDeviceById } from "../dal/device.dal.js";
import { RequestStatus } from "../constants/status.js";
import {
    RecommendationCode,
    RecommendationPriority
} from "../constants/recommendation.js";
import { ActivityIdeas } from "../constants/activityIdeas.js";
import { validateDeviceAccess } from "./device.service.js";


function ensureChildBelongsToParent(childList, childId) {
    const child = childList.find((c) => String(c._id) === String(childId));

    if (!child) {
        throw new AppError(CommonErrors.CHILD_NOT_FOUND);
    }

    return child;
}


function buildChildInterestRecommendations(child) {
    const interests = Array.isArray(child?.interests) ? child.interests : [];

    if (interests.length === 0) {
        return ActivityIdeas.slice(0, 4);
    }

    const matched = ActivityIdeas.filter((activity) =>
        activity.tags.some((tag) => interests.includes(tag))
    );

    if (matched.length === 0) {
        return ActivityIdeas.slice(0, 4);
    }

    return matched.slice(0, 4);
}

export async function getChildInterestRecommendations(parentId, childId) {
    const childList = await getChildrenByParentId(parentId);
    const child = ensureChildBelongsToParent(childList, childId);

    const recommendations = buildChildInterestRecommendations(child);

    return {
        childId,
        interests: child.interests || [],
        recommendations
    };
}

function buildParentsRecommendations({ child, device, requests }) {
    const recommendations = [];

    const screenTime = device?.screenTime || {};

    const pendingRequests = requests.filter(
        (r) => r.status === RequestStatus.PENDING
    );

    const approvedRequests = requests.filter(
        (r) => r.status === RequestStatus.APPROVED
    );

    const isHighDailyUsage =
        screenTime.isLimitEnabled === true &&
        Number(screenTime.dailyLimitMinutes) > 0 &&
        Number(screenTime.usedTodayMinutes) / Number(screenTime.dailyLimitMinutes) >= 0.8;

    if (approvedRequests.length >= 3) {
        recommendations.push({
            code: RecommendationCode.REVIEW_DAILY_LIMIT,
            title: "Consider Reviewing the Daily Limit",
            description: "The child has requested and received additional screen time several times. The daily limit may not match their routine.",
            priority: RecommendationPriority.HIGH
        });
    }

    if (pendingRequests.length > 0) {
        recommendations.push({
            code: RecommendationCode.PENDING_REQUESTS,
            title: "Pending Extension Requests",
            description: `You have ${pendingRequests.length} requests waiting for approval or rejection.`,
            priority: RecommendationPriority.MEDIUM
        });
    }

    if (screenTime.isLimitEnabled !== true) {
        recommendations.push({
            code: RecommendationCode.ENABLE_LIMIT,
            title: "Consider Enabling a Screen Time Limit",
            description: "Screen time limits are currently not active. Setting one can help create a consistent routine.",
            priority: RecommendationPriority.HIGH
        });
    }

    if (isHighDailyUsage) {
        recommendations.push({
            code: RecommendationCode.HIGH_DAILY_USAGE,
            title: "Today's usage is close to the daily limit",
            description: "The child has already used a large portion of the daily screen time. You may want to check if the limit fits their routine.",
            priority: RecommendationPriority.MEDIUM
        });
    }

    if (isHighDailyUsage || approvedRequests.length >= 3) {
        recommendations.push({
            code: RecommendationCode.SUGGEST_ACTIVITY,
            title: "Consider suggesting an alternative activity",
            description: "High screen usage or repeated requests for extra time were detected. You may want to suggest a sports, creative, or family activity instead of additional screen time.",
            priority: RecommendationPriority.MEDIUM
        });
    }

    if (!screenTime.dailyLimitMinutes || Number(screenTime.dailyLimitMinutes) <= 0) {
        recommendations.push({
            code: RecommendationCode.SET_DAILY_LIMIT,
            title: "Consider setting a daily limit",
            description: "There is currently no clear daily screen time limit. Setting one can help create a consistent routine.",
            priority: RecommendationPriority.HIGH
        });
    }

    if (!screenTime.weeklySchedule || screenTime.weeklySchedule.length === 0) {
        recommendations.push({
            code: RecommendationCode.SET_WEEKLY_SCHEDULE,
            title: "Consider setting a weekly routine",
            description: "A consistent weekly schedule can help create clear boundaries throughout the week.",
            priority: RecommendationPriority.LOW
        });
    }

    if (device?.isLocked === true) {
        recommendations.push({
            code: RecommendationCode.CHECK_LOCK_REASON,
            title: "Check if the device still needs to be locked",
            description: "The device is currently locked. You may want to check whether the lock is temporary or if the settings should be updated.",
            priority: RecommendationPriority.LOW
        });
    }

    if (child?.birthDate) {
        const birth = new Date(child.birthDate);
        const today = new Date();

        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();

        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--;
        }

        if (age >= 6 && age <= 10) {
            recommendations.push({
                code: RecommendationCode.YOUNG_CHILD_GUIDANCE,
                title: "For younger children, simple and clear boundaries are recommended",
                description: "At younger ages, it is helpful to set simple and consistent limits that are easy to understand and follow.",
                priority: RecommendationPriority.LOW
            });
        }
    }

    return recommendations;
}

export async function getParentRecommendations(parentId, childId, deviceId) {
    const childList = await getChildrenByParentId(parentId);
    const child = ensureChildBelongsToParent(childList, childId);

    const device = await validateDeviceAccess({ deviceId, parentId, childId });

    const requests = await findRequestsByChild({
        parentId,
        childId
    });

    const recommendations = buildParentsRecommendations({
        child,
        device,
        requests
    });

    return {
        childId,
        deviceId,
        recommendations
    };
}