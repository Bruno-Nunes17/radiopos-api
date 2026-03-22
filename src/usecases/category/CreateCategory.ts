import { prisma } from "../../lib/db.js";

interface CreateCategoryInput {
  name: string;
  color: string;
  colorBg: string;
}

export class CreateCategory {
  async execute(dto: CreateCategoryInput) {
    const category = await prisma.category.create({
      data: {
        name: dto.name,
        color: dto.color,
        colorBg: dto.colorBg,
      },
    });

    return category;
  }
}
