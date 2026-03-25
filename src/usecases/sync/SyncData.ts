import { prisma } from "../../lib/db.js";

interface SyncDataInput {
  since: string;
}

export class SyncData {
  async execute(dto: SyncDataInput) {
    const sinceDate = new Date(dto.since);

    const [categories, subcategories, incidences, allCategoryIds, allSubcategoryIds, allIncidenceIds] = await Promise.all([
      // Query 1 — categories
      prisma.category.findMany({
        where: {
          updatedAt: { gt: sinceDate },
        },
      }),

      // Query 2 — subcategories
      prisma.subcategory.findMany({
        where: {
          updatedAt: { gt: sinceDate },
        },
        include: {
          categoria: true,
        },
      }),

      // Query 3 — incidences
      prisma.incidence.findMany({
        where: {
          updatedAt: { gt: sinceDate },
        },
        include: {
          subcategoria: {
            include: {
              categoria: true,
            },
          },
          params: true,
          criteria: true,
          medias: true,
        },
      }),

      // IDs para verificação de cache
      prisma.category.findMany({ select: { id: true } }),
      prisma.subcategory.findMany({ select: { id: true } }),
      prisma.incidence.findMany({ select: { id: true } }),
    ]);

    return {
      syncedAt: new Date().toISOString(),
      categories,
      subcategories,
      incidences,
      allIds: {
        categories: allCategoryIds.map((c) => c.id),
        subcategories: allSubcategoryIds.map((s) => s.id),
        incidences: allIncidenceIds.map((i) => i.id),
      },
    };
  }
}
