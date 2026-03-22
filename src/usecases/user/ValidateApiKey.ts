import { createHash } from "node:crypto";
import { prisma } from "../../lib/db.js";

export class ValidateApiKey {
  async execute(apiKey: string) {
    const keyHash = createHash("sha256").update(apiKey).digest("hex");

    const keyRecord = await prisma.apiKey.findUnique({
      where: { keyHash },
    });

    if (!keyRecord || !keyRecord.active) {
      return null;
    }

    // Atualizar último uso de forma assíncrona (não bloqueante)
    prisma.apiKey.update({
      where: { id: keyRecord.id },
      data: { lastUsedAt: new Date() },
    }).catch(err => console.error("Erro ao atualizar lastUsedAt:", err));

    return keyRecord;
  }
}
