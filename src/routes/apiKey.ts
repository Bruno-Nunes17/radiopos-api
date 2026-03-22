import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { 
  createApiKeySchema, 
  listApiKeysSchema, 
  revokeApiKeySchema 
} from "../schemas/apiKey.js";
import { CreateApiKey } from "../usecases/user/CreateApiKey.js";
import { ListApiKeys } from "../usecases/user/ListApiKeys.js";
import { RevokeApiKey } from "../usecases/user/RevokeApiKey.js";
import { NotFoundError } from "../errors/index.js";

export const apiKeyRoutes = async (app: FastifyInstance) => {
  // Todas as rotas de gerenciamento de API Keys requerem autenticação JWT E ser ADMIN
  app.addHook("preHandler", app.authenticate);
  app.addHook("preHandler", app.isAdmin);

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/",
    schema: createApiKeySchema,
    handler: async (request, reply) => {
      try {
        const { name } = request.body;
        const createApiKey = new CreateApiKey();
        const result = await createApiKey.execute(name);

        return reply.status(201).send(result);
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
    schema: listApiKeysSchema,
    handler: async (request, reply) => {
      try {
        const listApiKeys = new ListApiKeys();
        const apiKeys = await listApiKeys.execute();

        return reply.status(200).send(apiKeys);
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
    method: "DELETE",
    url: "/:id",
    schema: revokeApiKeySchema,
    handler: async (request, reply) => {
      try {
        const { id } = request.params;
        const revokeApiKey = new RevokeApiKey();
        await revokeApiKey.execute(id);

        return reply.status(204).send();
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
