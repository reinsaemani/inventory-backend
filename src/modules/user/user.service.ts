import { prisma } from "../../utils/prisma";
import { TUpdateUserSchema } from "../../types/zod";

// =========================
// GET ALL USERS (ADMIN ONLY)
// =========================
export const getAllUsersService = async () => {
  return prisma.user.findMany({
    where: {
      deletedAt: null,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      isEmailVerified: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

// =========================
// GET USER BY ID
// =========================
export const getUserByIdService = async (id: string) => {
  return prisma.user.findUnique({
    where: {
      id,
      deletedAt: null,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      isEmailVerified: true,
      createdAt: true,
    },
  });
};

// =========================
// UPDATE USER (ADMIN + SELF)
// =========================
export const updateUserService = async (
  id: string,
  data: TUpdateUserSchema,
  context: {
    isAdmin: boolean;
    isSelf: boolean;
  }
) => {
  if (!context.isAdmin && !context.isSelf) {
    throw new Error("Forbidden");
  }

  const safeData: Partial<TUpdateUserSchema> = {};

  // SELF + ADMIN
  if (data.name !== undefined) safeData.name = data.name;
  if (data.email !== undefined) safeData.email = data.email;

  // ADMIN ONLY
  if (context.isAdmin) {
    if (data.role !== undefined) safeData.role = data.role;
    if (data.isActive !== undefined) safeData.isActive = data.isActive;
  }

  return prisma.user.update({
    where: { id },
    data: safeData,
  });
};

// =========================
// DELETE USER (ADMIN ONLY)
// =========================
export const deleteUserService = async (id: string, isAdmin: boolean) => {
  if (!isAdmin) {
    throw new Error("Forbidden");
  }

  return prisma.user.update({
    where: {
      id,
    },
    data: {
      deletedAt: new Date(),
      isActive: false,
      refreshToken: null,
    },
  });
};