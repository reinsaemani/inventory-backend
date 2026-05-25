import express from "express";
import "dotenv/config";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

import userRoutes from "./modules/user/user.routes";
import authRoutes from "./modules/auth/auth.routes";
import productRoutes from "./modules/product/product.routes";
import categoryRoutes from "./modules/category/category.routes";
import supplierRoutes from "./modules/supplier/supplier.routes";
import warehouseRoutes from "./modules/warehouse/warehouse.routes";
import inventoryRoutes from "./modules/inventory/inventory.routes";
import stockMovementRoutes from "./modules/stock-movement/stock-movement.routes";
import otpRoutes from "./modules/otp/otp.routes";
import twoFactorRoutes from "./modules/settings/twoFactor/twoFactor.route";
import requestLogger from "./middleware/requestLogger";
import { errorHandler } from "./middleware/error-handler";
import { notFoundHandler } from "./middleware/not-found";
import dashboardRoutes from "./modules/dashboard/dashboard.routes";


const app = express();

const port = Number(process.env.PORT) || 3000;

// ======================================================
// CORS
// ======================================================

const corsOptions = {
  origin:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.ORIGIN,

  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],

  credentials: true,

  optionsSuccessStatus: 204,
};

// ======================================================
// RATE LIMITER
// ======================================================

const globalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    error: {
      message: "Too many requests, slow down",
    },
  },
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    error: {
      message: "Too many login attempts, try again later",
    },
  },
});

// ======================================================
// GLOBAL MIDDLEWARE
// ======================================================

app.use(helmet());

app.use(cors(corsOptions));

if (process.env.NODE_ENV === "production") {
  app.use(globalLimiter);
}

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(requestLogger);

// ======================================================
// HEALTH CHECK
// ======================================================

app.get("/health", (_, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: "OK",
      uptime: process.uptime(),
      timestamp: new Date(),
    },
  });
});

// ======================================================
// ROOT
// ======================================================

app.get("/", (_, res) => {
  res.status(200).json({
    success: true,
    message: "Inventory API is running 🚀",
  });
});

// ======================================================
// ROUTES
// ======================================================


if (process.env.NODE_ENV === "production") {
  app.use("/api/auth", loginLimiter, authRoutes);
} else {
  app.use("/api/auth", authRoutes);
}

app.use("/api/otp", otpRoutes);

app.use("/api/users", userRoutes);

app.use("/api/products", productRoutes);

app.use("/api/categories", categoryRoutes);

app.use("/api/suppliers", supplierRoutes);

app.use("/api/warehouses", warehouseRoutes);

app.use("/api/inventories", inventoryRoutes);

app.use("/api/stock-movements", stockMovementRoutes);

app.use("/api/settings/2fa", twoFactorRoutes);

app.use("/api/dashboard", dashboardRoutes);


// ======================================================
// NOT FOUND
// ======================================================

app.use(notFoundHandler);

// ======================================================
// ERROR HANDLER
// ======================================================

app.use(errorHandler);

// ======================================================
// SERVER
// ======================================================

app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${port}`);
});