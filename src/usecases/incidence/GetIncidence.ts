import { prisma } from "../../lib/db.js";
import { NotFoundError } from "../../errors/index.js";

export class GetIncidence {
  async execute(id: string) {
    const incidence = await prisma.incidence.findUnique({
      where: { id },
      include: {
        params: true,
        criteria: true,
        medias: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    if (!incidence) {
      throw new NotFoundError("Incidência não encontrada");
    }

    return incidence;
  }
}
