import { ZodTypeProvider } from "fastify-type-provider-zod";
import { FastifyInstance } from "fastify";
import { loginSchema, registerSchema } from "../schemas/user.js";
import { ConflictError, UnauthorizedError } from "../errors/index.js";
import { RegisterUser } from "../usecases/RegisterUser.js";
import { LoginUser } from "../usecases/LoginUser.js";

export const userRoutes = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/register",
    schema: registerSchema,
    handler: async (request, reply) => {
      try {
        const registerUser = new RegisterUser();
        const user = await registerUser.execute(request.body);

        return reply.status(201).send({
          message: "Usuário registrado com sucesso",
          user,
        });
      } catch (error) {
        app.log.error(error);

        if (error instanceof ConflictError) {
          return reply.status(409).send({
            error: error.message,
            code: "CONFLICT_ERROR",
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
    method: "POST",
    url: "/login",
    schema: loginSchema,
    handler: async (request, reply) => {
      try {
        const loginUser = new LoginUser();
        const result = await loginUser.execute(request.body);

        const token = request.server.jwt.sign({
          sub: result.user.id,
          role: result.user.role,
        });

        return reply.status(200).send({
          token,
          user: result.user,
        });
      } catch (error) {
        app.log.error(error);

        if (error instanceof UnauthorizedError) {
          return reply.status(401).send({
            error: error.message,
            code: "UNAUTHORIZED_ERROR",
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
