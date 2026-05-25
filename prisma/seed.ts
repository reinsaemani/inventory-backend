import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import bcrypt from "bcryptjs";

import { PrismaClient } from "../generated/prisma/client";

import {
  UserRole,
  StockMovementType,
} from "../generated/prisma/enums";

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // ======================================================
  // 1. USERS
  // ======================================================

  const hashedPassword = await bcrypt.hash("password123", 10);

const admin = await prisma.user.upsert({
  where: {
    email: "reinsaemani@gmail.com",
  },
  update: {},
  create: {
    name: "Admin",
    email: "reinsaemani@gmail.com",
    password: hashedPassword,
    role: UserRole.ADMIN,

    // =========================
    // IMPORTANT (AUTH FLOW FIX)
    // =========================
    isActive: true,
    isEmailVerified: true,
  },
});

const staff = await prisma.user.upsert({
  where: {
    email: "staff@test.com",
  },
  update: {},
  create: {
    name: "Staff",
    email: "staff@test.com",
    password: hashedPassword,
    role: UserRole.STAFF,

    // default flow user (harus OTP + set password)
    isActive: false,
    isEmailVerified: false,
  },
});

  console.log("👤 Users seeded");

  // ======================================================
  // 2. CATEGORIES
  // ======================================================

  const keyboardCategory = await prisma.category.upsert({
    where: {
      name: "Keyboard",
    },
    update: {},
    create: {
      name: "Keyboard",
      description: "Keyboard products",
    },
  });

  const mouseCategory = await prisma.category.upsert({
    where: {
      name: "Mouse",
    },
    update: {},
    create: {
      name: "Mouse",
      description: "Mouse products",
    },
  });

  console.log("🗂️ Categories seeded");

  // ======================================================
  // 3. SUPPLIERS
  // ======================================================

  const supplier = await prisma.supplier.create({
    data: {
      name: "Tech Supplier",
      email: "supplier@test.com",
      phone: "08123456789",
      address: "Jakarta, Indonesia",
    },
  });

  console.log("🏢 Supplier seeded");

  // ======================================================
  // 4. WAREHOUSES
  // ======================================================

  const warehouse = await prisma.warehouse.create({
    data: {
      name: "Main Warehouse",
      location: "Semarang",
    },
  });

  console.log("🏬 Warehouse seeded");

  // ======================================================
  // 5. PRODUCTS
  // ======================================================

  const keyboard = await prisma.product.create({
    data: {
      sku: "KB-001",
      name: "Mechanical Keyboard",
      description: "RGB Mechanical Keyboard",
      price: 500000,

      categoryId: keyboardCategory.id,
      supplierId: supplier.id,
    },
  });

  const mouse = await prisma.product.create({
    data: {
      sku: "MS-001",
      name: "Gaming Mouse",
      description: "High precision gaming mouse",
      price: 250000,

      categoryId: mouseCategory.id,
      supplierId: supplier.id,
    },
  });

  console.log("📦 Products seeded");

  // ======================================================
  // 6. INVENTORIES
  // ======================================================

  await prisma.inventory.createMany({
    data: [
      {
        warehouseId: warehouse.id,
        productId: keyboard.id,
        quantity: 10,
      },
      {
        warehouseId: warehouse.id,
        productId: mouse.id,
        quantity: 20,
      },
    ],
  });

  console.log("📊 Inventories seeded");

  // ======================================================
  // 7. STOCK MOVEMENTS
  // ======================================================

  await prisma.stockMovement.createMany({
    data: [
      {
        type: StockMovementType.IN,
        quantity: 10,
        note: "Initial stock keyboard",

        productId: keyboard.id,
        userId: admin.id,
      },
      {
        type: StockMovementType.IN,
        quantity: 20,
        note: "Initial stock mouse",

        productId: mouse.id,
        userId: staff.id,
      },
    ],
  });

  console.log("📈 Stock movements seeded");

  console.log("✅ Seeding completed!");
}

main()
  .catch((error) => {
    console.error("❌ Seed error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });