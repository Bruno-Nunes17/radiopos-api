import { z } from "zod";
import { ErrorSchema } from "./auth.js";

const mediaTypeEnum = z.enum(["illustration", "xray"]);

export const incidenceSchema = z.object({
  id: z.string().uuid(),
  subcategoriaId: z.string().uuid(),
  name: z.string().min(1),
  routine: z.boolean().default(false),
  position: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  structures: z.string().nullable().optional(),
  techTip: z.string().nullable().optional(),
  youtubeId: z.string().nullable().optional(),
  youtubeTitle: z.string().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  params: z.object({
    id: z.string().uuid(),
    centralRay: z.string().nullable().optional(),
    ffd: z.string().nullable().optional(),
    kvp: z.number().nullable().optional(),
    mas: z.any().nullable().optional(), // Decimal from Prisma
    cassetteSize: z.string().nullable().optional(),
    collimation: z.string().nullable().optional(),
  }).nullable().optional(),
  criteria: z.array(z.object({
    id: z.string().uuid(),
    description: z.string(),
  })).optional(),
  medias: z.array(z.object({
    id: z.string().uuid(),
    type: mediaTypeEnum,
    url: z.string().url(),
    caption: z.string().nullable().optional(),
    order: z.number(),
  })).optional(),
});

export const createIncidenceSchema = {
  description: "Criar uma nova incidência com parâmetros técnicos, critérios e mídias",
  summary: "Criar incidência",
  tags: ["Incidência"],
  body: z.object({
    subcategoriaId: z.string().uuid(),
    name: z.string().min(1),
    routine: z.boolean().optional(),
    position: z.string().optional(),
    description: z.string().optional(),
    structures: z.string().optional(),
    techTip: z.string().optional(),
    youtubeId: z.string().optional(),
    youtubeTitle: z.string().optional(),
    params: z.object({
      centralRay: z.string().optional(),
      ffd: z.string().optional(),
      kvp: z.number().optional(),
      mas: z.number().optional(), // We accept number and convert to Decimal
      cassetteSize: z.string().optional(),
      collimation: z.string().optional(),
    }).optional(),
    criteria: z.array(z.object({
      description: z.string(),
    })).optional(),
    medias: z.array(z.object({
      type: mediaTypeEnum,
      url: z.string().url(),
      caption: z.string().optional(),
      order: z.number(),
    })).optional(),
  }),
  response: {
    201: incidenceSchema,
    401: ErrorSchema,
    404: ErrorSchema,
    500: ErrorSchema,
  },
};

export const listIncidencesSchema = {
  description: "Listar todas as incidências ou filtrar por subcategoria e rotina",
  summary: "Listar incidências",
  tags: ["Incidência"],
  query: z.object({
    subcategoriaId: z.string().uuid().optional(),
    routine: z.string()
      .optional()
      .transform((val) => val === "true" ? true : val === "false" ? false : undefined),
  }),
  response: {
    200: z.array(incidenceSchema),
    401: ErrorSchema,
    500: ErrorSchema,
  },
};

export const updateIncidenceSchema = {
  description: "Atualizar uma incidência e seus dados relacionados",
  summary: "Atualizar incidência",
  tags: ["Incidência"],
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    subcategoriaId: z.string().uuid().optional(),
    name: z.string().min(1).optional(),
    routine: z.boolean().optional(),
    position: z.string().optional(),
    description: z.string().optional(),
    structures: z.string().optional(),
    techTip: z.string().optional(),
    youtubeId: z.string().optional(),
    youtubeTitle: z.string().optional(),
    params: z.object({
      centralRay: z.string().optional(),
      ffd: z.string().optional(),
      kvp: z.number().optional(),
      mas: z.number().optional(),
      cassetteSize: z.string().optional(),
      collimation: z.string().optional(),
    }).optional(),
    criteria: z.array(z.object({
      id: z.string().uuid().optional(), // If provided, updates. If not, can be handled as new or we can simplify.
      description: z.string(),
    })).optional(),
    medias: z.array(z.object({
      id: z.string().uuid().optional(),
      type: mediaTypeEnum,
      url: z.string().url(),
      caption: z.string().optional(),
      order: z.number(),
    })).optional(),
  }),
  response: {
    200: incidenceSchema,
    401: ErrorSchema,
    404: ErrorSchema,
    500: ErrorSchema,
  },
};

export const deleteIncidenceSchema = {
  description: "Deletar uma incidência e retornar a lista atualizada da subcategoria",
  summary: "Deletar incidência",
  tags: ["Incidência"],
  params: z.object({
    id: z.string().uuid(),
  }),
  response: {
    200: z.array(incidenceSchema),
    401: ErrorSchema,
    404: ErrorSchema,
    500: ErrorSchema,
  },
};

export const getIncidenceSchema = {
  description: "Obter uma incidência específica pelo seu ID",
  summary: "Obter incidência",
  tags: ["Incidência"],
  params: z.object({
    id: z.string().uuid(),
  }),
  response: {
    200: incidenceSchema,
    401: ErrorSchema,
    404: ErrorSchema,
    500: ErrorSchema,
  },
};
