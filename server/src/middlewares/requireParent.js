import { Auth as AuthErrors } from "../constants/errors.js";
import { Role } from "../constants/role.js";

// set by authJwt to be an authenticated parent, use after authJwt.
export function requireParent(req, res, next) {
  const parentId = req.user?.parentId;
  const role = req.user?.role;

  if (!parentId) {
    const e = AuthErrors.NO_AUTH;
    return res.status(e.status).json({ ok: false, error: { code: e.code, message: e.message } });
  }
  if (role !== Role.PARENT) {
    const e = AuthErrors.FORBIDDEN;
    return res.status(e.status).json({ ok: false, error: { code: e.code, message: e.message } });
  }
  next();
}
