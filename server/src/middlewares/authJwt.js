import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { Auth as AuthErrors } from "../constants/errors.js";
import ParentModel from "../models/parent.model.js";

export async function authJwt(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    const e = AuthErrors.NO_TOKEN;
    return res.status(e.status).json({ ok: false, error: { code: e.code, message: e.message } });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = decoded; // { parentId, role, iat, exp }

// Security Check: Prevent usage of old tokens after logout
// The server decodes the Child's token and finds the 'parentId' inside the payload

if (decoded?.parentId) {
  const parent = await ParentModel.findById(decoded.parentId)
    .select("lastLogoutAt")
    .lean();

  if (!parent) {
    return res.status(401).json({ ok: false, message: "User not found" });
  }

  // Compare token issuance time with last logout time
  if (parent.lastLogoutAt) {
    const lastLogoutTime = new Date(parent.lastLogoutAt).getTime() / 1000;

    // decoded.iat is the token creation time
    if (decoded.iat <= lastLogoutTime) {
      return res.status(401).json({ 
        ok: false, 
        message: "Token expired due to logout" 
      });
    }
  }
}
    next();
  } catch {
    const e = AuthErrors.INVALID_TOKEN;
    return res.status(e.status).json({ ok: false, error: { code: e.code, message: e.message } });
  }
}