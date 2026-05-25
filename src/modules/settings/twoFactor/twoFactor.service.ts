import { prisma } from "../../../utils/prisma";
import { TToggleTwoFactorInput } from "./twoFactor.type";

// =========================
// GET STATUS
// =========================
export const twoFactorgetStatusService = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      isTwoFactorEnabled: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return {
    enabled: user.isTwoFactorEnabled,
  };
};

// =========================
// TOGGLE 2FA
// =========================
export const twoFactortoggleService = async ({
  userId,
  enabled,
}: TToggleTwoFactorInput) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      isTwoFactorEnabled: enabled,
    },
    select: {
      isTwoFactorEnabled: true,
    },
  });

  return {
    enabled: user.isTwoFactorEnabled,
  };
};