import { prisma } from "../../utils/prisma";
import { OtpType } from "../../../generated/prisma/enums";
import { sendEmail } from "../../utils/email/email.service";
import { otpEmailTemplate } from "../../utils/email/email.template";

// =========================
// CREATE OTP
// =========================
export const createOtp = async (email: string, type: OtpType) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) throw new Error("User not found");

  const recentOtp = await prisma.otp.findFirst({
    where: {
      userId: user.id,
      type,
      verifiedAt: null,
      createdAt: {
        gte: new Date(Date.now() - 60 * 1000),
      },
    },
  });

  if (recentOtp) {
    throw new Error("Please wait 60 seconds before requesting new OTP");
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await prisma.otp.deleteMany({
    where: {
      userId: user.id,
      type,
      verifiedAt: null,
    },
  });

  await prisma.otp.create({
    data: {
      userId: user.id,
      type,
      code,
      expiresAt,
    },
  });

  await sendEmail(
    user.email,
    "Your OTP Code",
    otpEmailTemplate(code, user.email, expiresAt)
  );

  return {
    success: true,
    message: "OTP sent successfully",
  };
};

// =========================
// VERIFY OTP
// =========================
export const verifyOtp = async (
  email: string,
  code: string,
  type: OtpType
) => {
  const user = await prisma.user.findFirst({
    where: {
      email,
      deletedAt: null,
    },
  });

  if (!user) throw new Error("User not found");

  const updated = await prisma.otp.updateMany({
    where: {
      userId: user.id,
      code,
      type,
      verifiedAt: null,
      expiresAt: {
        gt: new Date(),
      },
    },
    data: {
      verifiedAt: new Date(),
    },
  });

  if (updated.count === 0) {
    throw new Error("Invalid or expired OTP");
  }

  if (type === OtpType.EMAIL_VERIFICATION) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
      },
    });
  }

  if (type === OtpType.LOGIN_VERIFICATION) {
    return {
      success: true,
      message: "OTP verified successfully",
      data: {
        nextStep: "LOGIN_SUCCESS",
      },
    };
  }

  if (type === OtpType.PASSWORD_SETUP) {
    return {
      success: true,
      message: "OTP verified successfully",
      data: {
        nextStep: "SET_PASSWORD",
      },
    };
  }

  return {
    success: true,
    message: "OTP verified successfully",
    data: {
      nextStep: "DONE",
    },
  };
};

// =========================
// RESEND OTP
// =========================
export const resendOtp = async (email: string, type: OtpType) => {
  return createOtp(email, type);
};