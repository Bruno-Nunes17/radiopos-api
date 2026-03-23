import "dotenv/config";
import fastifySwagger from "@fastify/swagger";
import fastifyApiReference from "@scalar/fastify-api-reference";
import Fastify from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import z from "zod";
import { env } from "./lib/env.js";
import { authPlugin } from "./lib/auth.js";
import { authRoutes } from "./routes/auth.js";
import { categoryRoutes } from "./routes/category.js";
import { subcategoryRoutes } from "./routes/subcategory.js";
import { incidenceRoutes } from "./routes/incidence.js";
import { syncRoutes } from "./routes/sync.js";
import { apiKeyRoutes } from "./routes/apiKey.js";
import fastifyCors from "@fastify/cors";

const app = Fastify({ logger: true });

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

await app.register(fastifyCors, {
  origin: "*",
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
});

await app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "RadioPos",
      description: "API para o manual de poscionamentos",
      version: "1.0.0",
    },
    servers: [
      {
        description: "Localhost",
        url: "http://localhost:4000",
      },
    ],
    security: [
      {
        bearerAuth: [],
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  transform: jsonSchemaTransform,
});

await app.register(authPlugin);
await app.register(authRoutes, { prefix: "/auth" });
await app.register(categoryRoutes, { prefix: "/category" });
await app.register(subcategoryRoutes, { prefix: "/subcategory" });
await app.register(incidenceRoutes, { prefix: "/incidence" });
await app.register(syncRoutes, { prefix: "/sync" });
await app.register(apiKeyRoutes, { prefix: "/api/v1/api-keys" });

await app.register(fastifyApiReference, {
  routePrefix: "/docs",
  configuration: {
    sources: [
      {
        title: "RadioPos API",
        slug: "radiopos-api",
        url: "/swagger.json",
      },
      {
        title: "Auth API",
        slug: "auth-api",
        url: "/api/auth/open-api/generate-schema",
      },
    ],
  },
});

app.withTypeProvider<ZodTypeProvider>().route({
  method: "GET",
  url: "/swagger.json",
  schema: {
    hide: true,
  },
  handler: async () => {
    return app.swagger();
  },
});

app.withTypeProvider<ZodTypeProvider>().route({
  method: "GET",
  url: "/",
  schema: {
    description: "Hello world",
    tags: ["Hello World"],
    hide: true,
    response: {
      200: z.object({
        message: z.string(),
      }),
    },
  },
  handler: () => {
    return {
      message: "Hello World",
    };
  },
});

try {
  await app.listen({ host: "0.0.0.0", port: env.PORT });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
