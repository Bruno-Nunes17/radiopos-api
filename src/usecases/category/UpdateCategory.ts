import { prisma } from "../../lib/db.js";
import { NotFoundError } from "../../errors/index.js";

interface UpdateCategoryInput {
  id: string;
  name?: string;
  color?: string;
  colorBg?: string;
}

export class UpdateCategory {
  async execute(dto: UpdateCategoryInput) {
    const categoryExists = await prisma.category.findUnique({
      where: { id: dto.id },
    });

    if (!categoryExists) {
      throw new NotFoundError("Categoria não encontrada");
    }

    const updatedCategory = await prisma.category.update({
      where: { id: dto.id },
      data: {
        name: dto.name,
        color: dto.color,
        colorBg: dto.colorBg,
      },
    });

    return updatedCategory;
  }
}
