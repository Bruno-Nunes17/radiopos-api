import { prisma } from "../../lib/db.js";
import { NotFoundError } from "../../errors/index.js";

export class DeleteCategory {
  async execute(id: string) {
    const categoryExists = await prisma.category.findUnique({
      where: { id },
    });

    if (!categoryExists) {
      throw new NotFoundError("Categoria não encontrada");
    }

    await prisma.category.delete({
      where: { id },
    });
  }
}
