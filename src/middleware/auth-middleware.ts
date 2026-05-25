import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwtHandler";
import { UserRole } from "../../generated/prisma/enums";
import { prisma } from "../utils/prisma";

type DecodedToken = {
  id: string;
  role: UserRole;
};

export const protectAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cookieToken = req.cookies?.accessToken;

    const authHeader = req.headers.authorization;

    const headerToken =
      authHeader?.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;

    const token = cookieToken || headerToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - no token provided",
      });
    }

    const decoded = verifyToken(token) as DecodedToken;

    if (!decoded?.id || !decoded?.role) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await prisma.user.findFirst({
      where: {
        id: decoded.id,
        deletedAt: null,
      },
      select: {
        id: true,
        role: true,
        isActive: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account disabled",
      });
    }

    req.user = {
      id: user.id,
      role: user.role,
    };

    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};