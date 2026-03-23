import { prisma } from "../../lib/db.js";
import { NotFoundError } from "../../errors/index.js";

interface UpdateIncidenceInput {
  id: string;
  subcategoriaId?: string;
  name?: string;
  routine?: boolean;
  position?: string;
  description?: string;
  structures?: string;
  techTip?: string;
  youtubeLink?: string;
  youtubeTitle?: string;
  params?: {
    centralRay?: string;
    ffd?: string;
    kvp?: number;
    mas?: number;
    cassetteSize?: string;
  };
  criteria?: Array<{
    description: string;
  }>;
  medias?: Array<{
    type: "illustration" | "xray";
    url: string;
    caption?: string;
    order: number;
    sizeInBytes?: number;
    format?: string;
  }>;
}

export class UpdateIncidence {
  async execute(dto: UpdateIncidenceInput) {
    const incidenceExists = await prisma.incidence.findUnique({
      where: { id: dto.id },
    });

    if (!incidenceExists) {
      throw new NotFoundError("Incidência não encontrada");
    }

    if (dto.subcategoriaId) {
      const subcategoryExists = await prisma.subcategory.findUnique({
        where: { id: dto.subcategoriaId },
      });
      if (!subcategoryExists) {
        throw new NotFoundError("Subcategoria não encontrada");
      }
    }

    return await prisma.$transaction(async (tx) => {
      // Handle params (upsert style)
      if (dto.params) {
        await tx.technicalParams.upsert({
          where: { incidenciaId: dto.id },
          update: dto.params,
          create: { ...dto.params, incidenciaId: dto.id },
        });
      }

      // Handle criteria (delete all and recreate for simplicity as typical in such APIs, or we could do sync)
      if (dto.criteria) {
        await tx.evaluationCriteria.deleteMany({
          where: { incidenciaId: dto.id },
        });
        await tx.evaluationCriteria.createMany({
          data: dto.criteria.map(c => ({ ...c, incidenciaId: dto.id })),
        });
      }

      // Handle medias
      if (dto.medias) {
        await tx.media.deleteMany({
          where: { incidenciaId: dto.id },
        });
        await tx.media.createMany({
          data: dto.medias.map(m => ({ ...m, incidenciaId: dto.id })),
        });
      }

      const updatedIncidence = await tx.incidence.update({
        where: { id: dto.id },
        data: {
          subcategoriaId: dto.subcategoriaId,
          name: dto.name,
          routine: dto.routine,
          position: dto.position,
          description: dto.description,
          structures: dto.structures,
          techTip: dto.techTip,
          youtubeLink: dto.youtubeLink,
          youtubeTitle: dto.youtubeTitle,
        },
        include: {
          params: true,
          criteria: true,
          medias: true,
        },
      });

      return updatedIncidence;
    });
  }
}
