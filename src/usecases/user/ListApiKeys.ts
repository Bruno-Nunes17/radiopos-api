import { prisma } from "../../lib/db.js";

export class ListApiKeys {
  async execute() {
    return prisma.apiKey.findMany({
      orderBy: { createdAt: "desc" },
    });
  }
}
