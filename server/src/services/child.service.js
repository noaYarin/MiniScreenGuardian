import { AppError } from "../utils/appError.js";
import { Common as CommonErrors, ChildProfileImage } from "../constants/errors.js";
import { Role } from "../constants/role.js";
import { Gender } from "../constants/gender.js";
import {
  updateCurrentChildProfileByParentId,
  updateChildProfileImgByParentId,
} from "../dal/parent.dal.js";
import { sendAuditLog } from "./audit.service.js";
import { AuditActionType } from "../constants/auditActionType.js";

const MIN_CHILD_AGE = 6;
const MAX_CHILD_AGE = 17;

function calculateAge(birthDate) {
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}

function validateBirthDate(birthDate) {
  if (typeof birthDate !== "string") {
    throw new AppError(CommonErrors.VALIDATION_BIRTHDATE_INVALID);
  }

  const match = birthDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (!match) {
    throw new AppError(CommonErrors.VALIDATION_BIRTHDATE_INVALID);
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  if (month < 1 || month > 12) {
    throw new AppError(CommonErrors.VALIDATION_BIRTHDATE_INVALID);
  }

  const parsedBirthDate = new Date(year, month - 1, day);

  if (
    parsedBirthDate.getFullYear() !== year ||
    parsedBirthDate.getMonth() !== month - 1 ||
    parsedBirthDate.getDate() !== day
  ) {
    throw new AppError(CommonErrors.VALIDATION_BIRTHDATE_INVALID);
  }

  if (parsedBirthDate > new Date()) {
    throw new AppError(CommonErrors.VALIDATION_BIRTHDATE_INVALID);
  }

  const age = calculateAge(parsedBirthDate);

  if (age < MIN_CHILD_AGE || age > MAX_CHILD_AGE) {
    throw new AppError(CommonErrors.VALIDATION_CHILD_AGE_OUT_OF_RANGE);
  }

  return parsedBirthDate;
}

export function validateAndBuildChildDoc(body = {}) {
  const { name, birthDate, gender, interests } = body;

  if (!name || typeof name !== "string" || !name.trim()) {
    throw new AppError(CommonErrors.VALIDATION_NAME_REQUIRED);
  }

  if (name.trim().length > 30) {
    throw new AppError(CommonErrors.VALIDATION_NAME_TOO_LONG);
  }

  let bday;
  if (birthDate !== undefined) {
    bday = validateBirthDate(birthDate);
  }

  if (gender !== undefined && !Object.values(Gender).includes(gender)) {
    throw new AppError(CommonErrors.VALIDATION_GENDER_INVALID);
  }

  return {
    name: name.trim(),
    birthDate: bday,
    gender: gender || undefined,
    interests: Array.isArray(interests) ? interests : [],
    coins: 0,
    isActive: true,
    role: Role.CHILD,
    achievementIds: [],
    img: "",
    avatar: { level: 1, currentXp: 0, nextLevelXp: 100 },
  };
}


export function validateChildProfileUpdate(birthDate, gender) {

  if (birthDate === undefined && gender === undefined) {
    throw new AppError(CommonErrors.VALIDATION_AT_LEAST_ONE_FIELD_REQUIRED);
  }

  let parsedBirthDate;

  if (birthDate !== undefined) {
    parsedBirthDate = validateBirthDate(birthDate);
  }

  if (gender !== undefined && !Object.values(Gender).includes(gender)) {
    throw new AppError(CommonErrors.VALIDATION_GENDER_INVALID);
  }

  return {
    birthDate: parsedBirthDate,
    gender,
  };
}

export async function updateCurrentChildProfile(parentId, childId, birthDate, gender) {
  const validated = validateChildProfileUpdate(birthDate, gender);

  const updated = await updateCurrentChildProfileByParentId(
    parentId,
    childId,
    validated.birthDate,
    validated.gender
  );

  if (!updated) {
    throw new AppError(CommonErrors.CHILD_NOT_FOUND);
  }

  try {
    await sendAuditLog({
      parentId,
      childId,
      actionType: AuditActionType.CHILD_PROFILE_UPDATED,
    });
  } catch (err) {
    console.error("sendAuditLog failed in updateCurrentChildProfile:", err.message);
  }

  return { child: updated };
}

export async function updateChildProfileImageByParent(parentId, childId, img) {
  // Maximum allowed characters for Base64 profile image string (approx. 2.8MB).
  const MAX_PROFILE_IMAGE_CHARS = 2_800_000;

  if (typeof img !== "string" || !img.trim()) {
    throw new AppError(ChildProfileImage.REQUIRED);
  }
  if (img.length > MAX_PROFILE_IMAGE_CHARS) {
    throw new AppError(ChildProfileImage.TOO_LARGE);
  }
  const trimmed = img.trim();
  if (!trimmed.startsWith("data:image/")) {
    throw new AppError(ChildProfileImage.INVALID);
  }

  const updated = await updateChildProfileImgByParentId(parentId, childId, trimmed);

  if (!updated) {
    throw new AppError(CommonErrors.CHILD_NOT_FOUND);
  }
  try {
    await sendAuditLog({
      parentId,
      childId,
      actionType: AuditActionType.CHILD_PROFILE_UPDATED,
    });
  } catch (err) {
    console.error("sendAuditLog failed in updateChildProfileImageByParent:", err.message);
  }
  return { child: updated };
}