import {
  registerParent,
  loginParent,
  forgotPassword,
  resetPassword,
  logoutParent,
} from "../services/auth.service.js";
import { Auth as AuthErrors } from "../constants/errors.js";
import { updateDevicesIsActiveByParentId } from "../dal/device.dal.js";

export async function registerParentController(req, res, next) {
  try {
    const { email, password, name, phoneNumber } = req.body;
    const data = await registerParent({ email, password, name, phoneNumber });
    res.status(201).json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}

export async function loginParentController(req, res, next) {
  try {
    const { email, password } = req.body;
    const data = await loginParent({ email, password });
    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}



export async function forgotPasswordController(req, res, next) {
  try {
    const { email } = req.body;
    if (!email) {
      const error = AuthErrors.MISSING_EMAIL;
      return res.status(error.status).json({
        ok: false,
        error: { code: error.code, message: error.message },
      });
    }

    const isSent = await forgotPassword({ email });

    if (!isSent) {
      const error = AuthErrors.EMAIL_SEND_FAILED;
      return res
        .status(error.status)
        .json({ ok: false, error: { code: error.code, message: error.message } });
    }

    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

export async function resetPasswordController(req, res, next) {
  try {
    const { email, otpCode, password } = req.body;

    if (!email || !otpCode || !password) {
      const error = AuthErrors.MISSING_TOKEN_OR_NEW_PASSWORD;
      return res.status(error.status).json({
        ok: false,
        error: { code: error.code, message: error.message },
      });
    }

    const data = await resetPassword({ email, otpCode, password });

    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}

export async function logoutParentController(req, res, next) {
  try {
    const parentId = req.user?.parentId;
    if (!parentId) {
      const e = AuthErrors.NO_AUTH;
      return res.status(e.status).json({ ok: false, error: { code: e.code, message: e.message } });
    }

    await updateDevicesIsActiveByParentId(parentId, false);

    await logoutParent(parentId);
    res.status(200).json({ ok: true, message: "Logged out successfully" });
  } catch (err) {
    next(err);
  }
}