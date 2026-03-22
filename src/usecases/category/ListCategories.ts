import { prisma } from "../../lib/db.js";

export class ListCategories {
  async execute() {
    return prisma.category.findMany({
      orderBy: { name: "asc" },
    });
  }
}
