/* eslint-disable @typescript-eslint/no-unused-vars */
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import fastifyJwt from "@fastify/jwt"
import fp from "fastify-plugin"
import { env } from "./env.js"
import { ValidateApiKey } from '../usecases/user/ValidateApiKey.js'

async function authPluginRaw(app: FastifyInstance) {
  app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
  })

  app.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify()
      } catch (err) {
        console.log(err);
        
        return reply.status(401).send({ 
          error: "Não autorizado", 
          code: "UNAUTHORIZED" 
        })
      }
    }
  )

  app.decorate(
    "authenticateAny",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
        return;
      } catch (err) {
        // Silencioso: se falhar JWT, tentamos API Key abaixo
      }

   
      const apiKey = request.headers["x-api-key"] as string;


      if (apiKey) {
        const validateApiKey = new ValidateApiKey();
        const keyRecord = await validateApiKey.execute(apiKey);

        if (keyRecord) {
          request.apiKeyId = keyRecord.id;
          return; 
        }
      }

      return reply.status(401).send({ 
        error: "Acesso negado: JWT ou API Key inválida", 
        code: "UNAUTHORIZED" 
      });
    }
  )

  app.decorate(
    "isAdmin",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const payload = request.user as { role: string };
        if (payload.role !== "ADMIN") {
          return reply.status(403).send({ 
            error: "Acesso restrito a administradores", 
            code: "FORBIDDEN" 
          });
        }
      } catch (err) {
        return reply.status(403).send({ 
          error: "Erro ao verificar permissões", 
          code: "FORBIDDEN" 
        });
      }
    }
  )
}

export const authPlugin = fp(authPluginRaw)

declare module "fastify" {
  export interface FastifyRequest {
    apiKeyId?: string;
  }

  export interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>;
    isAdmin: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>;
    authenticateAny: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>;
  }
}
