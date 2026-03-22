import { ZodTypeProvider } from "fastify-type-provider-zod";
import { FastifyInstance } from "fastify";
import { 
  createIncidenceSchema, 
  listIncidencesSchema, 
  updateIncidenceSchema, 
  deleteIncidenceSchema,
  getIncidenceSchema
} from "../schemas/incidence.js";
import { NotFoundError } from "../errors/index.js";
import { CreateIncidence } from "../usecases/incidence/CreateIncidence.js";
import { ListIncidences } from "../usecases/incidence/ListIncidences.js";
import { UpdateIncidence } from "../usecases/incidence/UpdateIncidence.js";
import { DeleteIncidence } from "../usecases/incidence/DeleteIncidence.js";
import { GetIncidence } from "../usecases/incidence/GetIncidence.js";

export const incidenceRoutes = async (app: FastifyInstance) => {
  // Unificar autenticação: GET aceita JWT ou API Key, outros exigem JWT
  app.addHook("preHandler", async (request, reply) => {
    if (request.method === "GET") {
      await app.authenticateAny(request, reply);
    } else {
      await app.authenticate(request, reply);
    }
  });

  // Rotas de Leitura
  app.withTypeProvider<ZodTypeProvider>().route({

    method: "GET",
    url: "/:id",
    schema: getIncidenceSchema,
    handler: async (request, reply) => {
      try {
        const getIncidence = new GetIncidence();
        const incidence = await getIncidence.execute(request.params.id);

        return reply.status(200).send(incidence);
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
    schema: listIncidencesSchema,
    handler: async (request, reply) => {
      try {
        const query = request.query as { subcategoriaId?: string; routine?: boolean };
        const listIncidences = new ListIncidences();
        const incidences = await listIncidences.execute(query);

        return reply.status(200).send(incidences);
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
    method: "POST",
    url: "/",
    schema: createIncidenceSchema,
    handler: async (request, reply) => {
      try {
        const createIncidence = new CreateIncidence();
        const incidence = await createIncidence.execute(request.body);

        return reply.status(201).send(incidence);
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
    method: "PATCH",
    url: "/:id",
    schema: updateIncidenceSchema,
    handler: async (request, reply) => {
      try {
        const updateIncidence = new UpdateIncidence();
        const incidence = await updateIncidence.execute({
          id: request.params.id,
          ...request.body,
        });

        return reply.status(200).send(incidence);
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
    schema: deleteIncidenceSchema,
    handler: async (request, reply) => {
      try {
        const deleteIncidence = new DeleteIncidence();
        const updatedList = await deleteIncidence.execute(request.params.id);

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
