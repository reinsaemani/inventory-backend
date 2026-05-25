import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { prisma } from "../../utils/prisma";

import * as otpService from "../otp/otp.service";
import { OtpType, UserRole } from "../../../generated/prisma/enums";

const JWT_SECRET = process.env.JWT_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

// =========================
// TYPES
// =========================
type TokenUser = {
  id: string;
  role: string;
};

// =========================
// REGISTER (ADMIN INVITE FLOW)
// =========================
export const register = async (data: {
  name: string;
  email: string;
  role: UserRole;
}) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser && !existingUser.deletedAt) {
    throw new Error("Email already registered");
  }

  let user;

  if (existingUser?.deletedAt) {
    user = await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        name: data.name,
        role: data.role,
        deletedAt: null,
        isActive: false,
        isEmailVerified: false,
        refreshToken: null,
      },
    });
  } else {
    user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        role: data.role,
        isActive: false,
        isEmailVerified: false,
      },
    });
  }

  await otpService.createOtp(data.email, OtpType.EMAIL_VERIFICATION);

  return user;
};

// =========================
// LOGIN (STEP 1 ONLY: PASSWORD VALIDATION)
// =========================
export const login = async (email: string, password: string) => {
  const user = await prisma.user.findFirst({
    where: { email, deletedAt: null },
  });

  if (!user) throw new Error("Invalid email or password");

  if (!user.password) {
    throw new Error("Password not set. Please set your password first.");
  }

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    throw new Error("Invalid email or password");
  }

  if (!user.isEmailVerified) {
    await otpService.createOtp(user.email, OtpType.EMAIL_VERIFICATION);
    throw new Error("Account not verified. OTP sent to email.");
  }

  if (!user.isActive) {
    throw new Error("Account has been disabled");
  }

  // 2FA FLOW (ONLY TRIGGER OTP, NO MAGIC ERROR STRINGS)
  if (user.isTwoFactorEnabled) {
    await otpService.createOtp(user.email, OtpType.LOGIN_VERIFICATION);

    return {
      requires2FA: true,
      message: "OTP sent for login verification",
    };
  }

  const accessToken = generateAccessToken({
    id: user.id,
    role: user.role,
  });

  const refreshToken = generateRefreshToken({
    id: user.id,
    role: user.role,
  });

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  const { password: _, refreshToken: __, ...safeUser } = user;

  return {
    accessToken,
    refreshToken,
    user: safeUser,
  };
};

// =========================
// ME
// =========================
export const me = async (userId: string) => {
  return prisma.user.findFirst({
    where: { id: userId, deletedAt: null },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      isEmailVerified: true,
      isTwoFactorEnabled: true,
    },
  });
};

// =========================
// RESET PASSWORD
// =========================
export const resetPassword = async (userId: string, newPassword: string) => {
  const hashed = await bcrypt.hash(newPassword, 10);

  return prisma.user.update({
    where: { id: userId },
    data: {
      password: hashed,
      refreshToken: null,
    },
  });
};

// =========================
// LOGOUT
// =========================
export const logout = async (refreshToken?: string) => {
  if (!refreshToken) return;

  try {
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as any;

    if (decoded?.id) {
      await prisma.user.update({
        where: { id: decoded.id },
        data: { refreshToken: null },
      });
    }
  } catch {}
};

// =========================
// REFRESH TOKEN
// =========================
export const refreshToken = async (token: string) => {
  const decoded = jwt.verify(token, REFRESH_SECRET) as any;

  const user = await prisma.user.findFirst({
    where: {
      id: decoded.id,
      deletedAt: null,
      isActive: true,
      isEmailVerified: true,
    },
    select: {
      id: true,
      role: true,
      refreshToken: true,
    },
  });

  if (!user) throw new Error("Invalid refresh token");
  if (user.refreshToken !== token) throw new Error("Invalid refresh token");

  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken: newRefreshToken },
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

// =========================
// TOKEN GENERATORS
// =========================
const generateAccessToken = (user: TokenUser) => {
  return jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: "15m",
  });
};

const generateRefreshToken = (user: TokenUser) => {
  return jwt.sign({ id: user.id }, REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

// =========================
// SET INITIAL PASSWORD (OTP FLOW: PASSWORD_SETUP)
// =========================
export const setInitialPassword = async (
  email: string,
  newPassword: string
) => {
  const user = await prisma.user.findFirst({
    where: { email, deletedAt: null },
  });

  if (!user) throw new Error("User not found");

  if (!user.isEmailVerified) {
    throw new Error("Email not verified");
  }

  if (user.password) {
    throw new Error("Password already set");
  }

  const hashed = await bcrypt.hash(newPassword, 10);

  return prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashed,
      isActive: true,
    },
    select: {
      id: true,
      email: true,
      name: true,
    },
  });
};


export const loginVerifyOtp = async (
  email: string,
  code: string
) => {
  const user = await prisma.user.findFirst({
    where: {
      email,
      deletedAt: null,
      isActive: true,
      isEmailVerified: true,
    },
  });

  if (!user) throw new Error("User not found");

  const otp = await prisma.otp.findFirst({
    where: {
      userId: user.id,
      type: OtpType.LOGIN_VERIFICATION,
      code,
      verifiedAt: null,
      expiresAt: { gt: new Date() },
    },
  });

  if (!otp) {
    throw new Error("Invalid or expired OTP");
  }

  await prisma.otp.update({
    where: { id: otp.id },
    data: { verifiedAt: new Date() },
  });

  const accessToken = generateAccessToken({
    id: user.id,
    role: user.role,
  });

  const refreshToken = generateRefreshToken({
    id: user.id,
    role: user.role,
  });

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  // FIX: jangan pakai user lama tanpa select
  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    isEmailVerified: user.isEmailVerified,
    isTwoFactorEnabled: user.isTwoFactorEnabled,
  };

  return {
    accessToken,
    refreshToken,
    user: safeUser,
  };
};