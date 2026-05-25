import { Request, Response, NextFunction } from "express";
import { sendForbiddenResponse, sendUnauthorizedResponse } from "../utils/responseHandler";
import { UserRole } from "../../generated/prisma/enums";


export const requireRole = (roles: UserRole[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    const user = req.user;

    // =========================
    // NOT LOGIN
    // =========================
    if (!user) {
      return sendUnauthorizedResponse(res, "Unauthorized");
    }

    // =========================
    // ROLE CHECK
    // =========================
    if (!roles.includes(user.role)) {
      return sendForbiddenResponse(
        res,
        user.role !== UserRole.ADMIN
          ? "Sorry, you are not admin"
          : "Forbidden: insufficient role"
      );
    }

    next();
  };
};