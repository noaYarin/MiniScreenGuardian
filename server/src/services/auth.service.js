import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { AppError } from "../utils/appError.js";
import { Auth as AuthErrors } from "../constants/errors.js";
import {
  createParent,
  findParentByEmail,
  setPasswordResetCodeByEmail,
  findParentByEmailAndValidResetCode,
  updateParentPasswordAndClearReset,
  setParentLastLogoutAt,
} from "../dal/parent.dal.js";
import { Role } from "../constants/role.js";
import { sendEmail } from "./emailService.js";
import { passwordResetTemplate } from "../templates/passwordResetTemplate.js";

const BCRYPT_ROUNDS = 10;

function signToken(payload) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
}

function issueAuthResponse(parent) {
  const parentId = parent._id.toString();
  const token = signToken({ parentId, role: Role.PARENT});
  return { token, parentId };
}

// Token for child to access the app with scan the QR 
export async function issueChildToken(parentId, childId, deviceId) {
  const parentIdStr = parentId != null ? String(parentId) : null;
  const childIdStr = childId != null ? String(childId) : null;
  const deviceIdStr = deviceId != null ? String(deviceId) : null;

  const token = signToken({ 
    parentId: parentIdStr, 
    childId: childIdStr, 
    deviceId: deviceIdStr, 
    role: Role.CHILD 
  });

  return { 
    token, 
    parentId: parentIdStr, 
    childId: childIdStr,
    deviceId: deviceIdStr 
  };
}

export async function registerParent({ email, password, name, phoneNumber }) {
  const existing = await findParentByEmail(email);
  if (existing) {
    throw new AppError(AuthErrors.EMAIL_EXISTS);
  }

  const hash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const created = await createParent({
    email,
    password: hash,
    name,
    phoneNumber,
    children: [],
  });

  return issueAuthResponse(created);
}

export async function loginParent({ email, password }) {
  const parent = await findParentByEmail(email);
  if (!parent) {
    throw new AppError(AuthErrors.INVALID_CREDENTIALS);
  }

  const valid = await bcrypt.compare(password, parent.password);
  if (!valid) {
    throw new AppError(AuthErrors.INVALID_CREDENTIALS);
  }

  return issueAuthResponse(parent);
}

export async function forgotPassword({ email }) {
  const parent = await findParentByEmail(email);
  if (!parent) {
    throw new AppError(AuthErrors.EMAIL_NOT_FOUND);
  }

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

  await setPasswordResetCodeByEmail(email, otpCode, expiresAt);
  
  //Template for reset password email
  const html = passwordResetTemplate({ otpCode });

  try {
    await sendEmail({
      to: email,
      subject: "Reset your password for ScreenGuardian app",
      html,
    });
    return true;
  } catch (error) {
    console.error("Failed to send reset password email:", error);
    return false;
  }
}

export async function resetPassword({ email, otpCode, password }) {
  const now = new Date();
  const parent = await findParentByEmailAndValidResetCode(email, otpCode, now);

  if (!parent) {
    throw new AppError(AuthErrors.RESET_TOKEN_INVALID);
  }

  const hash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  await updateParentPasswordAndClearReset(parent._id, hash);
  return issueAuthResponse(parent);
}

// Secure logout: invalidate existing JWTs for this parent (and their child tokens).
export async function logoutParent(parentId) {
  await setParentLastLogoutAt(parentId, new Date());
  return { parentId: String(parentId) };
}
