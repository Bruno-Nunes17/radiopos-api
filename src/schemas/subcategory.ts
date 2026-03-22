import { z } from "zod";
import { ErrorSchema } from "./auth.js";
import { incidenceSchema } from "./incidence.js";

export const subcategorySchema = z.object({
  id: z.string().uuid(),
  categoriaId: z.string().uuid(),
  name: z.string().min(1),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const subcategoryWithIncidencesSchema = subcategorySchema.extend({
  incidencias: z.array(incidenceSchema),
});

export const createSubcategorySchema = {
  description: "Criar uma nova subcategoria vinculada a uma categoria",
  summary: "Criar subcategoria",
  tags: ["Subcategoria"],
  body: z.object({
    categoriaId: z.string().uuid(),
    name: z.string().min(1),
  }),
  response: {
    201: subcategorySchema,
    401: ErrorSchema,
    404: ErrorSchema,
    500: ErrorSchema,
  },
};

export const listSubcategoriesSchema = {
  description: "Listar todas as subcategorias ou filtrar por categoria",
  summary: "Listar subcategorias",
  tags: ["Subcategoria"],
  query: z.object({
    categoriaId: z.string().uuid().optional(),
  }),
  response: {
    200: z.array(subcategorySchema),
    401: ErrorSchema,
    500: ErrorSchema,
  },
};

export const listSubcategoriesWithIncidencesSchema = {
  description: "Listar subcategorias e suas incidências de uma categoria específica",
  summary: "Listar subcategorias com incidências",
  tags: ["Subcategoria"],
  params: z.object({
    categoriaId: z.string().uuid(),
  }),
  response: {
    200: z.array(subcategoryWithIncidencesSchema),
    401: ErrorSchema,
    500: ErrorSchema,
  },
};

export const updateSubcategorySchema = {
  description: "Atualizar uma subcategoria existente",
  summary: "Atualizar subcategoria",
  tags: ["Subcategoria"],
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    categoriaId: z.string().uuid().optional(),
    name: z.string().min(1).optional(),
  }),
  response: {
    200: subcategorySchema,
    401: ErrorSchema,
    404: ErrorSchema,
    500: ErrorSchema,
  },
};

export const deleteSubcategorySchema = {
  description: "Deletar uma subcategoria e retornar a lista atualizada de subcategorias da mesma categoria",
  summary: "Deletar subcategoria",
  tags: ["Subcategoria"],
  params: z.object({
    id: z.string().uuid(),
  }),
  response: {
    200: z.array(subcategorySchema),
    401: ErrorSchema,
    404: ErrorSchema,
    500: ErrorSchema,
  },
};
