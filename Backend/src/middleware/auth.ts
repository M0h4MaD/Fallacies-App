import type { NextFunction, Request, Response } from "express";
import { verifySupabaseToken } from "../config/supabaseAuth.js";
import { prisma } from "../config/prisma.js";
import { AppError } from "./errorHandler.js";
import type { IdentifiedRequest } from "./identify.js";

export interface AuthedRequest extends Request {
  supabaseUser?: { id: string; email?: string; name?: string };
}

export async function verifySupabaseAuth(
  req: AuthedRequest,
  _res: Response,
  next: NextFunction,
) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer "))
    return next(new AppError("Missing or malformed Authorization header", 401));
  try {
    const claims = await verifySupabaseToken(header.slice("Bearer ".length));
    req.supabaseUser = {
      id: claims.sub,
      email: claims.email,
      name: claims.user_metadata?.full_name ?? claims.user_metadata?.name,
    };
    next();
  } catch {
    next(new AppError("Invalid or expired token", 401));
  }
}

export async function requireAdmin(
  req: AuthedRequest & IdentifiedRequest,
  _res: Response,
  next: NextFunction,
) {
  if (req.currentUser) {
    if (req.currentUser.role !== "admin")
      return next(new AppError("Admin access required", 403));
    return next();
  }
  if (!req.supabaseUser?.id)
    return next(new AppError("Authentication required", 401));
  const user = await prisma.user.findUnique({
    where: { supabaseUserId: req.supabaseUser.id },
  });
  if (user?.role !== "admin")
    return next(new AppError("Admin access required", 403));
  next();
}
