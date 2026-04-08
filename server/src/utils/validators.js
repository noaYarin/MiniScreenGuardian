import mongoose from "mongoose";
import { AppError } from "./appError.js";

export function assertValidObjectId(id, errorObj) {
  if (!mongoose.Types.ObjectId.isValid(String(id))) {
    throw new AppError(errorObj);
  }
}

export function assertBoolean(value, errorObj) {
  if (value === undefined || typeof value !== "boolean") {
    throw new AppError(errorObj);
  }
}

export function assertNonEmptyString(value, errorObj) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new AppError(errorObj);
  }
}

export function assertNumberInRange(value, { min, max }, errorObj) {
  if (typeof value !== "number" || Number.isNaN(value) || value < min || value > max) {
    throw new AppError(errorObj);
  }
}

export function assertOneOf(value, allowedValues, errorObj) {
  if (!allowedValues.includes(value)) {
    throw new AppError(errorObj);
  }
}