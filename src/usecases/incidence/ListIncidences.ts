import { prisma } from "../../lib/db.js";

interface ListIncidencesFilters {
  subcategoriaId?: string;
  routine?: boolean;
}

export class ListIncidences {
  async execute(filters: ListIncidencesFilters) {
    return prisma.incidence.findMany({
      where: {
        subcategoriaId: filters.subcategoriaId,
        routine: filters.routine,
      },
      include: {
        params: true,
        criteria: true,
        medias: true,
      },
      orderBy: { name: "asc" },
    });
  }
}
