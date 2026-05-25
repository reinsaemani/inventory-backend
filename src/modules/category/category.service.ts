import { auditInclude } from "../../utils/auditInclude";
import { prisma } from "../../utils/prisma";
import { TCategoryWrite } from "./category.type";

// GET ALL
export const getAllCategoriesService = async (
  skip: number,
  take: number,
  search?: string
) => {
  return prisma.category.findMany({
    where: {
      deletedAt: null,
      ...(search && {
        name: {
          contains: search,
          mode: "insensitive",
        },
      }),
    },
    skip,
    take,
    include: {
      _count: {
        select: {
          products: {
            where: {
              deletedAt: null,
            },
          },
        },
      },
      ...auditInclude,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

// COUNT
export const countCategoriesService = async (search?: string) => {
  return prisma.category.count({
    where: {
      deletedAt: null,
      ...(search && {
        name: {
          contains: search,
          mode: "insensitive",
        },
      }),
    },
  });
};

// GET BY ID
export const getCategoryByIdService = async (id: string) => {
  return prisma.category.findFirst({
    where: {
      id,
      deletedAt: null,
    },
    include: {
      _count: {
        select: {
          products: {
            where: {
              deletedAt: null,
            },
          },
        },
      },
      ...auditInclude,
    },
  });
};

// CREATE
export const createCategoryService = async (
  data: TCategoryWrite,
  userId: string
) => {
  return prisma.category.create({
    data: {
      name: data.name,
      description: data.description ?? null,
      createdById: userId,
    },
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          role: true,
        },
      },
    },
  });
};

// UPDATE
export const updateCategoryService = async (
  id: string,
  data: Partial<TCategoryWrite>,
  userId: string
) => {
  return prisma.category.update({
    where: { id },
    data: {
      ...(data.name ? { name: data.name } : {}),
      ...(data.description !== undefined
        ? { description: data.description ?? null }
        : {}),
      updatedById: userId,
    },
    include: {
      updatedBy: {
        select: {
          id: true,
          name: true,
          role: true,
        },
      },
    },
  });
};

// SOFT DELETE
export const deleteCategoryService = async (id: string) => {
  return prisma.category.update({
    where: { id },
    data: {
      deletedAt: new Date(),
    },
  });
};