import { UserRole } from "../../generated/prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name?: string;
        role: UserRole;
      };
    }
  }
}

export {};