export const auditInclude = {
  createdBy: {
    select: { id: true, name: true, role: true },
  },
  updatedBy: {
    select: { id: true, name: true, role: true },
  },
};