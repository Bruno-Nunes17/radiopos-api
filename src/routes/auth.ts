import { ZodTypeProvider } from "fastify-type-provider-zod";
import { FastifyInstance } from "fastify";
import { loginSchema, registerSchema, refreshSchema } from "../schemas/auth.js";
import { ConflictError, UnauthorizedError } from "../errors/index.js";
import { RegisterUser } from "../usecases/user/RegisterUser.js";
import { LoginUser } from "../usecases/user/LoginUser.js";
import { env } from "../lib/env.js";

export const authRoutes = async (app: FastifyInstance) => {
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

        const token = request.server.jwt.sign(
          {
            sub: result.user.id,
            role: result.user.role,
          },
          {
            expiresIn: "1d",
          }
        );


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

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/refresh",
    schema: refreshSchema,
    handler: async (request, reply) => {
      const { token } = request.body;

      try {
        // Verify the refresh token
        const payload = request.server.jwt.verify(token) as { sub: number; role: string };

        // Generate new access token
        const refreshToken = request.server.jwt.sign(
          {
            sub: payload.sub,
            role: payload.role,
          },
          {
            expiresIn: env.JWT_EXPIRY,
          }
        );

        return reply.status(200).send({
          refreshToken,
        });
      } catch (err) {
        app.log.error(err);
        return reply.status(401).send({
          error: "Refresh token inválido ou expirado",
          code: "UNAUTHORIZED_ERROR",
        });
      }
    },
  });
};
