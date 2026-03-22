import { prisma } from "../../lib/db.js";

interface SyncDataInput {
  since: string;
}

export class SyncData {
  async execute(dto: SyncDataInput) {
    const sinceDate = new Date(dto.since);

    const [categories, subcategories, incidences] = await Promise.all([
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
    ]);

    return {
      syncedAt: new Date().toISOString(),
      categories,
      subcategories,
      incidences,
    };
  }
}
