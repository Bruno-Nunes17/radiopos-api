import { z } from "zod";
import { ErrorSchema } from "./auth.js";
import { categorySchema } from "./category.js";
import { subcategorySchema } from "./subcategory.js";
import { incidenceSchema } from "./incidence.js";

export const syncSchema = {
  description: "Sincronizar dados a partir de uma data específica",
  summary: "Sincronizar dados",
  tags: ["Sincronização"],
  query: z.object({
    since: z.string().datetime({ message: "Formato de data ISO 8601 inválido" }),
  }),
  response: {
    200: z.object({
      syncedAt: z.string().datetime(),
      categories: z.array(categorySchema),
      subcategories: z.array(subcategorySchema.extend({
        categoria: categorySchema
      })),
      incidences: z.array(incidenceSchema.extend({
        subcategoria: subcategorySchema.extend({
          categoria: categorySchema
        })
      })),
    }),
    400: ErrorSchema,
    401: ErrorSchema,
    500: ErrorSchema,
  },
};
