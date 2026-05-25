import { Request, Response } from "express";
import * as authService from "./auth.service";

import {
  sendBadRequestResponse,
  sendForbiddenResponse,
  sendSuccessNoDataResponse,
  sendSuccessResponse,
  sendUnauthorizedResponse,
} from "../../utils/responseHandler";

// =========================
// COOKIE OPTIONS
// =========================
export const cookieOptions = () => {
  const isProd = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? ("none" as const) : ("lax" as const),
    path: "/",
    domain: isProd ? ".reintech.my.id" : undefined,
  };
};

// =========================
// REGISTER
// =========================
export const register = async (req: Request, res: Response) => {
  try {
    const user = await authService.register(req.body);

    return sendSuccessResponse(
      res,
      user,
      "User created successfully. OTP sent to email."
    );
  } catch (err: any) {
    return sendBadRequestResponse(res, err.message);
  }
};

// =========================
// LOGIN
// =========================
export const login = async (req: Request, res: Response) => {
  try {
    const result = await authService.login(
      req.body.email,
      req.body.password
    );

    // CASE 1: 2FA REQUIRED
    if (result?.requires2FA) {
      return sendSuccessResponse(res, result, result.message);
    }

    res.cookie("accessToken", result.accessToken, {
      ...cookieOptions(),
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", result.refreshToken, {
      ...cookieOptions(),
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return sendSuccessResponse(
      res,
      { user: result.user },
      "Login successful"
    );
  } catch (err: any) {
    return sendUnauthorizedResponse(res, err.message || "Login failed");
  }
};

// =========================
// SET INITIAL PASSWORD
// =========================
export const setInitialPassword = async (req: Request, res: Response) => {
  try {
    const { email, newPassword } = req.body;

    await authService.setInitialPassword(email, newPassword);

    return sendSuccessNoDataResponse(res, "Password set successfully");
  } catch (err: any) {
    return sendBadRequestResponse(res, err.message);
  }
};

// =========================
// ME
// =========================
export const me = async (req: Request, res: Response) => {
  try {
    const user = await authService.me(req.user!.id);

    if (!user) {
      return sendUnauthorizedResponse(res, "User not found");
    }

    return sendSuccessResponse(res, user, "User fetched successfully");
  } catch (err: any) {
    return sendBadRequestResponse(res, err.message);
  }
};

// =========================
// LOGOUT
// =========================
export const logout = async (req: Request, res: Response) => {
  try {
    await authService.logout(req.cookies.refreshToken);

    res.clearCookie("accessToken", cookieOptions());
    res.clearCookie("refreshToken", cookieOptions());

    return sendSuccessNoDataResponse(res, "Logged out successfully");
  } catch (err: any) {
    return sendBadRequestResponse(res, err.message);
  }
};

// =========================
// RESET PASSWORD
// =========================
export const resetPassword = async (req: Request, res: Response) => {
  try {
    await authService.resetPassword(req.user!.id, req.body.newPassword);

    res.clearCookie("accessToken", cookieOptions());
    res.clearCookie("refreshToken", cookieOptions());

    return sendSuccessNoDataResponse(res, "Password updated successfully");
  } catch (err: any) {
    return sendBadRequestResponse(res, err.message);
  }
};

// =========================
// REFRESH TOKEN
// =========================
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return sendUnauthorizedResponse(res, "No refresh token");
    }

    const result = await authService.refreshToken(token);

    res.cookie("accessToken", result.accessToken, {
      ...cookieOptions(),
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", result.refreshToken, {
      ...cookieOptions(),
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return sendSuccessResponse(res, null, "Token refreshed");
  } catch (err: any) {
    return sendForbiddenResponse(res, err.message);
  }
};

// =========================
// LOGIN VERIFY OTP
// =========================
export const loginVerifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body;

    const result = await authService.loginVerifyOtp(email, code);

    res.cookie("accessToken", result.accessToken, {
      ...cookieOptions(),
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", result.refreshToken, {
      ...cookieOptions(),
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return sendSuccessResponse(res, result, "Login success");
  } catch (err: any) {
    return sendUnauthorizedResponse(res, err.message);
  }
};