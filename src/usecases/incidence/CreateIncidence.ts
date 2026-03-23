import { prisma } from "../../lib/db.js";
import { NotFoundError } from "../../errors/index.js";

interface CreateIncidenceInput {
  subcategoriaId: string;
  name: string;
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

export class CreateIncidence {
  async execute(dto: CreateIncidenceInput) {
    const subcategoryExists = await prisma.subcategory.findUnique({
      where: { id: dto.subcategoriaId },
    });

    if (!subcategoryExists) {
      throw new NotFoundError("Subcategoria não encontrada");
    }

    const incidence = await prisma.incidence.create({
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
        params: dto.params ? {
          create: dto.params
        } : undefined,
        criteria: dto.criteria ? {
          create: dto.criteria
        } : undefined,
        medias: dto.medias ? {
          create: dto.medias
        } : undefined,
      },
      include: {
        params: true,
        criteria: true,
        medias: true,
      },
    });

    return incidence;
  }
}
