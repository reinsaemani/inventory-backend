import { Request, Response } from "express";

import * as twoFactorService from "./twoFactor.service";

import {
  sendBadRequestResponse,
  sendSuccessResponse,
} from "../../../utils/responseHandler";

// =========================
// GET STATUS
// =========================
export const twoFactorgetStatusController = async (
  req: Request,
  res: Response
) => {
  try {
    const data =
      await twoFactorService.twoFactorgetStatusService(
        req.user!.id
      );

    return sendSuccessResponse(
      res,
      data,
      "2FA status fetched"
    );
  } catch (err: any) {
    return sendBadRequestResponse(
      res,
      err.message
    );
  }
};

// =========================
// TOGGLE 2FA
// =========================
export const twoFactortoggleController = async (
  req: Request,
  res: Response
) => {
  try {
    const data =
      await twoFactorService.twoFactortoggleService({
        userId: req.user!.id,
        enabled: req.body.enabled,
      });

    return sendSuccessResponse(
      res,
      data,
      data.enabled
        ? "2FA enabled"
        : "2FA disabled"
    );
  } catch (err: any) {
    return sendBadRequestResponse(
      res,
      err.message
    );
  }
};