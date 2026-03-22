import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import fastifyJwt from "@fastify/jwt"
import fp from "fastify-plugin"
import { env } from "./env.js"

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
        
        reply.status(401).send({ message: "Não autorizado" })
      }
    }
  )
}

export const authPlugin = fp(authPluginRaw)

declare module "fastify" {
  export interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>
  }
}
