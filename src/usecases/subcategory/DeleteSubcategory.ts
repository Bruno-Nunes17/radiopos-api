import { prisma } from "../../lib/db.js";
import { NotFoundError } from "../../errors/index.js";

export class DeleteSubcategory {
  async execute(id: string) {
    const subcategoryExists = await prisma.subcategory.findUnique({
      where: { id },
    });

    if (!subcategoryExists) {
      throw new NotFoundError("Subcategoria não encontrada");
    }

    const { categoriaId } = subcategoryExists;

    await prisma.subcategory.delete({
      where: { id },
    });

    // Retorna a lista atualizada de subcategorias da mesma categoria
    return prisma.subcategory.findMany({
      where: { categoriaId },
      orderBy: { name: "asc" },
    });
  }
}
