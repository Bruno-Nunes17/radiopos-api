import { ZodTypeProvider } from "fastify-type-provider-zod";
import { FastifyInstance } from "fastify";
import {
  createCategorySchema,
  listCategoriesSchema,
  updateCategorySchema,
  deleteCategorySchema,
} from "../schemas/category.js";
import { NotFoundError } from "../errors/index.js";
import { CreateCategory } from "../usecases/category/CreateCategory.js";
import { ListCategories } from "../usecases/category/ListCategories.js";
import { UpdateCategory } from "../usecases/category/UpdateCategory.js";
import { DeleteCategory } from "../usecases/category/DeleteCategory.js";

export const categoryRoutes = async (app: FastifyInstance) => {
  // Unificar autenticação: GET aceita JWT ou API Key, outros exigem JWT
  app.addHook("preHandler", async (request, reply) => {
    if (request.method === "GET") {
      await app.authenticateAny(request, reply);
    } else {
      await app.authenticate(request, reply);
    }
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/",
    schema: createCategorySchema,
    handler: async (request, reply) => {
      try {
        const createCategory = new CreateCategory();
        const category = await createCategory.execute(request.body);

        return reply.status(201).send(category);
      } catch (error) {
        app.log.error(error);
        return reply.status(500).send({
          error: "Internal server error",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    },
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/",
    schema: listCategoriesSchema,
    handler: async (request, reply) => {
      try {
        const listCategories = new ListCategories();
        const categories = await listCategories.execute();

        return reply.status(200).send(categories);
      } catch (error) {
        app.log.error(error);
        return reply.status(500).send({
          error: "Internal server error",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    },
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "PATCH",
    url: "/:id",
    schema: updateCategorySchema,
    handler: async (request, reply) => {
      try {
        const updateCategory = new UpdateCategory();
        const category = await updateCategory.execute({
          id: request.params.id,
          ...request.body,
        });

        return reply.status(200).send(category);
      } catch (error) {
        app.log.error(error);

        if (error instanceof NotFoundError) {
          return reply.status(404).send({
            error: error.message,
            code: "NOT_FOUND_ERROR",
          });
        }

        return reply.status(500).send({
          error: "Internal server error",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    },
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "DELETE",
    url: "/:id",
    schema: deleteCategorySchema,
    handler: async (request, reply) => {
      try {
        const deleteCategory = new DeleteCategory();
        const updatedList = await deleteCategory.execute(request.params.id);

        return reply.status(200).send(updatedList);
      } catch (error) {
        app.log.error(error);

        if (error instanceof NotFoundError) {
          return reply.status(404).send({
            error: error.message,
            code: "NOT_FOUND_ERROR",
          });
        }

        return reply.status(500).send({
          error: "Internal server error",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    },
  });
};
