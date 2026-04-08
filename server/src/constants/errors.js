export const Pairing = {
  SHORT_CODE_COLLISION: { status: 503, code: "SHORT_CODE_COLLISION", message: "Could not generate unique code, try again" },
  LINK_NEED_ONE: { status: 400, code: "VALIDATION_ERROR", message: "Provide either code or barcodeToken" },
  LINK_ONLY_ONE: { status: 400, code: "VALIDATION_ERROR", message: "Provide only one of code or barcodeToken" },
  SESSION_NOT_FOUND: { status: 404, code: "SESSION_NOT_FOUND", message: "Pairing session not found" },
  SESSION_ALREADY_USED: { status: 410, code: "SESSION_ALREADY_USED", message: "This pairing code has already been used" },
  SESSION_EXPIRED: { status: 410, code: "SESSION_EXPIRED", message: "Pairing code has expired" },
  NO_CHILD: { status: 400, code: "NO_CHILD", message: "Parent has no active child" },
  CHILD_SELECTION_REQUIRED: { status: 400, code: "CHILD_SELECTION_REQUIRED", message: "Parent has more than one child; childId must be specified when generating the pairing code" },
  DEVICE_TYPE_REQUIRED: { status: 400, code: "VALIDATION_ERROR", message: "deviceType is required" },
  INVALID_DEVICE_TYPE: { status: 400, code: "VALIDATION_ERROR", message: "deviceType is invalid" },
  CHILD_NOT_ACTIVE: { status: 400, code: "CHILD_NOT_ACTIVE", message: "Child is not active" },
  SESSION_INVALID: { status: 410, code: "SESSION_INVALID", message: "Pairing code is invalid, expired, or already used" },
  DEVICE_ALREADY_LINKED: { status: 409, code: "DEVICE_ALREADY_LINKED", message: "Device is already linked to a child" },
};


export const Auth = {
  EMAIL_NOT_FOUND: { status: 404, code: "EMAIL_NOT_FOUND", message: "Email not found" },
  EMAIL_SEND_FAILED: { status: 500, code: "EMAIL_SEND_FAILED", message: "Failed to send email" },
  MISSING_TOKEN: { status: 400, code: "MISSING_TOKEN", message: "idToken is required" },
  EMAIL_EXISTS: { status: 409, code: "EMAIL_EXISTS", message: "Email already registered" },
  INVALID_CREDENTIALS: { status: 401, code: "INVALID_CREDENTIALS", message: "Invalid email or password" },
  NO_AUTH: { status: 401, code: "NO_AUTH", message: "Not authenticated" },
  FORBIDDEN: { status: 403, code: "FORBIDDEN", message: "Parents only" },
  NO_TOKEN: { status: 401, code: "NO_TOKEN", message: "Missing token" },
  INVALID_TOKEN: { status: 401, code: "INVALID_TOKEN", message: "Invalid token" },
  MISSING_EMAIL: { status: 400, code: "MISSING_EMAIL", message: "email is required" },
  RESET_TOKEN_INVALID: { status: 400, code: "RESET_TOKEN_INVALID", message: "Invalid or expired reset token" },
  MISSING_TOKEN_OR_NEW_PASSWORD: { status: 400, code: "MISSING_TOKEN_OR_NEW_PASSWORD", message: "token and newPassword are required" },
};

export const Common = {
  PARENT_NOT_FOUND: { status: 404, code: "PARENT_NOT_FOUND", message: "Parent not found" },
  CHILD_NOT_FOUND: { status: 400, code: "CHILD_NOT_FOUND", message: "Child does not belong to this parent" },
  INVALID_ID: { status: 400, code: "VALIDATION_ERROR", message: "Invalid id" },
  INVALID_PARENT_ID: { status: 400, code: "INVALID_ID", message: "Invalid parentId" },
  INVALID_CHILD_ID: { status: 400, code: "INVALID_ID", message: "Invalid childId" },
  INVALID_SESSION_ID: { status: 400, code: "INVALID_ID", message: "Invalid session id" },
  INVALID_DEVICE_ID: { status: 400, code: "INVALID_ID", message: "Invalid deviceId" },
  NOT_FOUND: { status: 404, code: "NOT_FOUND", message: "Child not found" },
  DEVICE_NOT_FOUND: { status: 404, code: "DEVICE_NOT_FOUND", message: "Device not found" },
  DEVICE_NOT_OWNED: { status: 403, code: "FORBIDDEN", message: "Device does not belong to this parent/child" },
  VALIDATION_NAME_BIRTHDATE: { status: 400, code: "VALIDATION_ERROR", message: "name and birthDate are required" },
  VALIDATION_NAME_REQUIRED: { status: 400, code: "VALIDATION_ERROR", message: "Name is required" },
  VALIDATION_NAME_TOO_LONG: { status: 400, code: "VALIDATION_ERROR", message: "Name is too long" },
  VALIDATION_BIRTHDATE_INVALID: { status: 400, code: "VALIDATION_ERROR", message: "birthDate must be a valid date" },
  VALIDATION_GENDER_INVALID: { status: 400, code: "VALIDATION_ERROR", message: "gender must be one of: boy, girl, other" },
  VALIDATION_CHILD_ID: { status: 400, code: "VALIDATION", message: "childId must be a valid ObjectId" },
  VALIDATION_IS_ACTIVE: { status: 400, code: "VALIDATION", message: "isActive must be boolean" },
  VALIDATION_INTERESTS: { status: 400, code: "VALIDATION_ERROR", message: "interests must be an array of strings" },
  LIMIT_MAX_CHILDREN_REACHED: { status: 409, code: "LIMIT_MAX_CHILDREN_REACHED", message: "Maximum of 8 children per account" },
  LIMIT_MAX_DEVICES_REACHED: { status: 409, code: "LIMIT_MAX_DEVICES_REACHED", message: "Maximum number of devices reached for this child" },
  DEVICE_PLATFORM_REQUIRED: { status: 400, code: "VALIDATION_ERROR", message: "platform is required" },
  DEVICE_NOT_ACTIVE: { status: 400, code: "DEVICE_NOT_ACTIVE", message: "Device is not active" },
  INVALID_DEVICE_PLATFORM: { status: 400, code: "VALIDATION_ERROR", message: "platform is invalid" },
  VALIDATION_ERROR: { status: 400, code: "VALIDATION_ERROR", message: "Validation error" },
  APP_NOT_FOUND: { status: 404, code: "APP_NOT_FOUND", message: "Application not found" },
  VALIDATION_CHILD_AGE_OUT_OF_RANGE: { status: 400, code: "VALIDATION_ERROR", message: "child age must be between 6 and 17" },
  VALIDATION_AT_LEAST_ONE_FIELD_REQUIRED: { status: 400, code: "VALIDATION_ERROR", message: "At least one field is required to update" },
};

export const Request = {
  REQUEST_NOT_FOUND: { status: 404, code: "REQUEST_NOT_FOUND", message: "Request not found" },
  REQUEST_NOT_PENDING: { status: 409, code: "REQUEST_NOT_PENDING", message: "Request is not pending" },
  INVALID_DECISION: { status: 400, code: "VALIDATION_ERROR", message: "decision must be APPROVED or REJECTED" },
  INVALID_REQUEST_ID: { status: 400, code: "INVALID_ID", message: "Invalid requestId" },
  INVALID_MINUTES: { status: 400, code: "VALIDATION_ERROR", message: "requestedMinutes must be between 1 and 120" },
  DEVICE_NOT_OWNED: { status: 403, code: "FORBIDDEN", message: "Device does not belong to this child/parent" },
  REQUEST_ALREADY_PENDING: { status: 409, code: "REQUEST_ALREADY_PENDING", message: "There is already a pending request for this device" },
  INVALID_REQUEST_STATUS: { status: 400, code: "VALIDATION_ERROR", message: "Invalid request status" },
};


export const ChildProfileImage = {
  REQUIRED: { status: 400, code: "VALIDATION_ERROR", message: "img is required" },
  TOO_LARGE: { status: 400, code: "VALIDATION_ERROR", message: "Profile image is too large" },
  INVALID: { status: 400, code: "VALIDATION_ERROR", message: "img must be a data URL image (data:image/...)" },
};