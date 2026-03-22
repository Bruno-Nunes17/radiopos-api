import { randomBytes, createHash } from "node:crypto";
import { prisma } from "../../lib/db.js";

export class CreateApiKey {
  async execute(name: string) {
    // Gerar uma chave aleatória de 32 bytes (64 chars em hex)
    const rawKey = randomBytes(32).toString("hex");
    
    // Prefixo para identificação visual (ex: rpos_...)
    const prefix = "rpos";
    const apiKey = `${prefix}_${rawKey}`;
    
    // Hash da chave para armazenamento seguro
    const keyHash = createHash("sha256").update(apiKey).digest("hex");

    const newApiKey = await prisma.apiKey.create({
      data: {
        name,
        prefix: `${prefix}_${rawKey.substring(0, 8)}...`, // Armazena apenas parte para identificação
        keyHash,
        active: true,
      },
    });

    return {
      apiKey, // Retorna a chave completa apenas na criação
      data: newApiKey,
    };
  }
}
