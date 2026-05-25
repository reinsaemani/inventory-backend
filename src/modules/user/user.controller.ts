import { Request, Response } from "express";
import * as userService from "./user.service";

import {
  sendSuccessResponse,
  sendNotFoundResponse,
  sendSuccessNoDataResponse,
  sendBadRequestResponse,
} from "../../utils/responseHandler";

import { updateUserSchema } from "../../types/zod";

// =========================
// GET ALL USERS (ADMIN)
// =========================
export const getAllUsersController = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsersService();

    return sendSuccessResponse(res, users, "Users fetched successfully");
  } catch (err: any) {
    return sendBadRequestResponse(res, err.message);
  }
};

// =========================
// GET USER BY ID (ADMIN)
// =========================
export const getUserByIdController = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);

    const user = await userService.getUserByIdService(id);

    if (!user) {
      return sendNotFoundResponse(res, "User not found");
    }

    return sendSuccessResponse(res, user, "User fetched successfully");
  } catch (err: any) {
    return sendBadRequestResponse(res, err.message);
  }
};

// =========================
// GET ME (SELF)
// =========================
export const getMeController = async (req: Request, res: Response) => {
  try {
    const user = await userService.getUserByIdService(req.user!.id);

    if (!user) {
      return sendNotFoundResponse(res, "User not found");
    }

    return sendSuccessResponse(res, user, "Profile fetched successfully");
  } catch (err: any) {
    return sendBadRequestResponse(res, err.message);
  }
};

// =========================
// UPDATE USER (ADMIN + SELF)
// =========================
export const updateUserController = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);

    const parsed = updateUserSchema.parse(req.body);

    const user = await userService.updateUserService(id, parsed, {
      isAdmin: req.user!.role === "ADMIN",
      isSelf: req.user!.id === id,
    });

    return sendSuccessResponse(res, user, "User updated successfully");
  } catch (err: any) {
    return sendBadRequestResponse(res, err.message);
  }
};

// =========================
// UPDATE ME (SELF ONLY)
// =========================
export const updateMeController = async (req: Request, res: Response) => {
  try {
    const parsed = updateUserSchema.parse(req.body);

    const user = await userService.updateUserService(
      req.user!.id,
      parsed,
      {
        isAdmin: false,
        isSelf: true,
      }
    );

    return sendSuccessResponse(res, user, "Profile updated successfully");
  } catch (err: any) {
    return sendBadRequestResponse(res, err.message);
  }
};

// =========================
// DELETE USER (ADMIN)
// =========================
export const deleteUserController = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);

    await userService.deleteUserService(id, true); // admin only via middleware anyway

    return sendSuccessNoDataResponse(res, "User deleted successfully");
  } catch (err: any) {
    return sendBadRequestResponse(res, err.message);
  }
};