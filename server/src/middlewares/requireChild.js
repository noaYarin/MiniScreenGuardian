import { Auth as AuthErrors } from "../constants/errors.js";

export function requireChild(req, res, next) {
    const childId = req.user?.childId;
    const role = req.user?.role;
  
    if (!childId || role !== "CHILD") {
      const e = AuthErrors.FORBIDDEN;
      return res.status(e.status).json({ ok: false, error: { code: e.code, message: e.message } });
    }
    next();
  }