import { prisma } from "../../lib/db.js";
import { NotFoundError } from "../../errors/index.js";

interface UpdateSubcategoryInput {
  id: string;
  categoriaId?: string;
  name?: string;
}

export class UpdateSubcategory {
  async execute(dto: UpdateSubcategoryInput) {
    const subcategoryExists = await prisma.subcategory.findUnique({
      where: { id: dto.id },
    });

    if (!subcategoryExists) {
      throw new NotFoundError("Subcategoria não encontrada");
    }

    if (dto.categoriaId) {
      const categoryExists = await prisma.category.findUnique({
        where: { id: dto.categoriaId },
      });

      if (!categoryExists) {
        throw new NotFoundError("Categoria não encontrada");
      }
    }

    const updatedSubcategory = await prisma.subcategory.update({
      where: { id: dto.id },
      data: {
        categoriaId: dto.categoriaId,
        name: dto.name,
      },
    });

    return updatedSubcategory;
  }
}
