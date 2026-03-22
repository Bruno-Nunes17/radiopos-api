import { prisma } from "../../lib/db.js";

export class ListSubcategoriesWithIncidences {
  async execute(categoriaId: string) {
    return prisma.subcategory.findMany({
      where: { categoriaId },
      include: {
        incidencias: {
          include: {
            params: true,
            criteria: true,
            medias: true,
          },
          orderBy: { name: "asc" },
        },
      },
      orderBy: { name: "asc" },
    });
  }
}
