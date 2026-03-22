import { z } from "zod";
import { ErrorSchema } from "./user.js";

export const categorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  color: z.string(),
  colorBg: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createCategorySchema = {
  description: "Criar uma nova categoria",
  summary: "Criar categoria",
  tags: ["Categoria"],
  body: z.object({
    name: z.string().min(1),
    color: z.string(),
    colorBg: z.string(),
  }),
  response: {
    201: categorySchema,
    401: ErrorSchema,
    500: ErrorSchema,
  },
};

export const listCategoriesSchema = {
  description: "Listar todas as categorias",
  summary: "Listar categorias",
  tags: ["Categoria"],
  response: {
    200: z.array(categorySchema),
    401: ErrorSchema,
    500: ErrorSchema,
  },
};

export const updateCategorySchema = {
  description: "Atualizar uma categoria existente",
  summary: "Atualizar categoria",
  tags: ["Categoria"],
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    name: z.string().min(1).optional(),
    color: z.string().optional(),
    colorBg: z.string().optional(),
  }),
  response: {
    200: categorySchema,
    401: ErrorSchema,
    404: ErrorSchema,
    500: ErrorSchema,
  },
};

export const deleteCategorySchema = {
  description: "Deletar uma categoria",
  summary: "Deletar categoria",
  tags: ["Categoria"],
  params: z.object({
    id: z.string().uuid(),
  }),
  response: {
    200: z.array(categorySchema),
    401: ErrorSchema,
    404: ErrorSchema,
    500: ErrorSchema,
  },
};
