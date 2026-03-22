import { ZodTypeProvider } from "fastify-type-provider-zod";
import { FastifyInstance } from "fastify";
import { 
  createSubcategorySchema, 
  listSubcategoriesSchema, 
  updateSubcategorySchema, 
  deleteSubcategorySchema 
} from "../schemas/subcategory.js";
import { NotFoundError } from "../errors/index.js";
import { CreateSubcategory } from "../usecases/subcategory/CreateSubcategory.js";
import { ListSubcategories } from "../usecases/subcategory/ListSubcategories.js";
import { UpdateSubcategory } from "../usecases/subcategory/UpdateSubcategory.js";
import { DeleteSubcategory } from "../usecases/subcategory/DeleteSubcategory.js";

export const subcategoryRoutes = async (app: FastifyInstance) => {
  // Aplicar autenticação para as rotas de escrita
  app.addHook("preHandler", app.authenticate);

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/",
    schema: createSubcategorySchema,
    handler: async (request, reply) => {
      try {
        const createSubcategory = new CreateSubcategory();
        const subcategory = await createSubcategory.execute(request.body);

        return reply.status(201).send(subcategory);
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
    method: "GET",
    url: "/",
    schema: listSubcategoriesSchema,
    handler: async (request, reply) => {
      try {
        const listSubcategories = new ListSubcategories();
        const subcategories = await listSubcategories.execute(request.query.categoriaId);

        return reply.status(200).send(subcategories);
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
    schema: updateSubcategorySchema,
    handler: async (request, reply) => {
      try {
        const updateSubcategory = new UpdateSubcategory();
        const subcategory = await updateSubcategory.execute({
          id: request.params.id,
          ...request.body,
        });

        return reply.status(200).send(subcategory);
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
    schema: deleteSubcategorySchema,
    handler: async (request, reply) => {
      try {
        const deleteSubcategory = new DeleteSubcategory();
        const updatedList = await deleteSubcategory.execute(request.params.id);

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
