export const REQUEST_CHILD_LOCATION = "REQUEST_CHILD_LOCATION";
export const REQUEST_REFRESH_FROM_PARENT = "REQUEST_REFRESH_FROM_PARENT";
export const LOCATION_LIVE_UPDATE = "LOCATION_LIVE_UPDATE";
export const PARENT_LOGOUT = "PARENT_LOGOUT";
export const FORCE_CHILD_LOGOUT = "FORCE_CHILD_LOGOUT";
export const JOIN_PARENT = "JOIN_PARENT";
export const JOIN_CHILD = "JOIN_CHILD";
export const NOTIFICATION_CREATED = "NOTIFICATION_CREATED";
export const DELETE_DEVICE = "DELETE_DEVICE";


// Sent from server to the child device when policy-related enforcement data changes
export const POLICY_UPDATED = "POLICY_UPDATED";

// Sent from server to the parent client when a child device status changes for real-time UI updates
export const DEVICE_STATUS_UPDATED = "DEVICE_STATUS_UPDATED";