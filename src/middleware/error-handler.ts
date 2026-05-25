import { z } from "zod";
import jwt from "jsonwebtoken";
import { Prisma } from "../../generated/prisma/client";
import {
  sendBadRequestResponse,
  sendErrorResponse,
  sendValidationError,
  sendUnauthorizedResponse,
  sendForbiddenResponse,
} from "../utils/responseHandler";

export const errorHandler = (
  error: any,
  req: any,
  res: any,
  next: any
) => {
  // =========================
  // ZOD VALIDATION ERROR
  // =========================
  if (error instanceof z.ZodError) {
    const errors = error.issues.map((e) => e.message);

    return sendValidationError(
      res,
      "Validation Error",
      errors
    );
  }

  // =========================
  // PRISMA ERROR
  // =========================
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return sendBadRequestResponse(
      res,
      process.env.NODE_ENV === "development"
        ? { error: "Prisma Error", details: error }
        : { error: "Database Error" }
    );
  }

  // =========================
  // JWT ERROR
  // =========================
  if (error instanceof jwt.JsonWebTokenError) {
    return sendUnauthorizedResponse(
      res,
      "Invalid token"
    );
  }

  // =========================
  // DEFAULT
  // =========================
  return sendErrorResponse(
    res,
    process.env.NODE_ENV === "development"
      ? error.message
      : "Internal Server Error"
  );
};