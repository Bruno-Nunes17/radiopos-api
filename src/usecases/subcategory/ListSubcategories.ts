import { prisma } from "../../lib/db.js";

export class ListSubcategories {
  async execute(categoriaId?: string) {
    return prisma.subcategory.findMany({
      where: categoriaId ? { categoriaId } : {},
      orderBy: { name: "asc" },
    });
  }
}
