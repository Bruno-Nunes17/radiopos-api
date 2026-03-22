import { prisma } from "../../lib/db.js";

export class ListIncidences {
  async execute(subcategoriaId?: string) {
    return prisma.incidence.findMany({
      where: subcategoriaId ? { subcategoriaId } : {},
      include: {
        params: true,
        criteria: true,
        medias: true,
      },
      orderBy: { name: "asc" },
    });
  }
}
