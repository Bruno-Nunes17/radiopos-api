import { z } from "zod";
import { ErrorSchema } from "./auth.js";

export const apiKeySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  prefix: z.string(),
  active: z.boolean(),
  lastUsedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createApiKeySchema = {
  description: "Gerar uma nova API Key (Apenas Admin)",
  summary: "Gerar API Key",
  tags: ["API Key"],
  body: z.object({
    name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  }),
  response: {
    201: z.object({
      apiKey: z.string(), // A chave em texto plano que será exibida apenas uma vez
      data: apiKeySchema,
    }),
    401: ErrorSchema,
    403: ErrorSchema,
    500: ErrorSchema,
  },
};

export const listApiKeysSchema = {
  description: "Listar todas as API Keys (Apenas Admin)",
  summary: "Listar API Keys",
  tags: ["API Key"],
  response: {
    200: z.array(apiKeySchema),
    401: ErrorSchema,
    403: ErrorSchema,
    500: ErrorSchema,
  },
};

export const revokeApiKeySchema = {
  description: "Revogar uma API Key específica (Apenas Admin)",
  summary: "Revogar API Key",
  tags: ["API Key"],
  params: z.object({
    id: z.string().uuid(),
  }),
  response: {
    204: z.null(),
    401: ErrorSchema,
    403: ErrorSchema,
    404: ErrorSchema,
    500: ErrorSchema,
  },
};
