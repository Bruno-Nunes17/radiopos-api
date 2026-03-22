import { prisma } from "../../lib/db.js";
import { NotFoundError } from "../../errors/index.js";

export class DeleteIncidence {
  async execute(id: string) {
    const incidenceExists = await prisma.incidence.findUnique({
      where: { id },
    });

    if (!incidenceExists) {
      throw new NotFoundError("Incidência não encontrada");
    }

    const { subcategoriaId } = incidenceExists;

    await prisma.incidence.delete({
      where: { id },
    });

    // Retorna a lista atualizada da subcategoria
    return prisma.incidence.findMany({
      where: { subcategoriaId },
      include: {
        params: true,
        criteria: true,
        medias: true,
      },
      orderBy: { name: "asc" },
    });
  }
}
