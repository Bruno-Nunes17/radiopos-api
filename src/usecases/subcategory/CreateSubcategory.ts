import { prisma } from "../../lib/db.js";
import { NotFoundError } from "../../errors/index.js";

interface CreateSubcategoryInput {
  categoriaId: string;
  name: string;
}

export class CreateSubcategory {
  async execute(dto: CreateSubcategoryInput) {
    const categoryExists = await prisma.category.findUnique({
      where: { id: dto.categoriaId },
    });

    if (!categoryExists) {
      throw new NotFoundError("Categoria não encontrada");
    }

    const subcategory = await prisma.subcategory.create({
      data: {
        categoriaId: dto.categoriaId,
        name: dto.name,
      },
    });

    return subcategory;
  }
}
