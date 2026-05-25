import { Request, Response } from "express";
import * as otpService from "./otp.service";

import {
  sendBadRequestResponse,
  sendSuccessNoDataResponse,
  sendSuccessResponse,
} from "../../utils/responseHandler";

// =========================
// VERIFY OTP
// =========================
export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, code, type } = req.body;

    const result = await otpService.verifyOtp(email, code, type);

    return sendSuccessResponse(
      res,
      result.data,
      result.message
    );
  } catch (err: any) {
    return sendBadRequestResponse(res, err.message);
  }
};

// =========================
// RESEND OTP
// =========================
export const resendOtp = async (req: Request, res: Response) => {
  try {
    const { email, type } = req.body;

    await otpService.resendOtp(email, type);

    return sendSuccessNoDataResponse(
      res,
      "OTP sent successfully"
    );
  } catch (err: any) {
    return sendBadRequestResponse(res, err.message);
  }
};