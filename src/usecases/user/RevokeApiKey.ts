import { prisma } from "../../lib/db.js";
import { NotFoundError } from "../../errors/index.js";

export class RevokeApiKey {
  async execute(id: string) {
    const apiKey = await prisma.apiKey.findUnique({
      where: { id },
    });

    if (!apiKey) {
      throw new NotFoundError("API Key não encontrada");
    }

    await prisma.apiKey.delete({
      where: { id },
    });
  }
}
