import { ZodTypeProvider } from "fastify-type-provider-zod";
import { FastifyInstance } from "fastify";
import { syncSchema } from "../schemas/sync.js";
import { SyncData } from "../usecases/sync/SyncData.js";

export const syncRoutes = async (app: FastifyInstance) => {
  app.addHook("preHandler", app.authenticateAny);

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/",
    schema: syncSchema,
    handler: async (request, reply) => {
      try {
        const query = request.query as { since: string };
        const syncData = new SyncData();
        const result = await syncData.execute(query);

        return reply.status(200).send(result);
      } catch (error) {
        app.log.error(error);
        return reply.status(500).send({
          error: "Internal server error",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    },
  });
};
