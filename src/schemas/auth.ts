import { z } from "zod";

export const ErrorSchema = z.object({
  error: z.string(),
  code: z.string(),
});

export const registerSchema = {
  description: "Registrar um novo usuário",
  summary: "Registrar usuário",
  tags: ["Usuário"],
  body: z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6),
  }),
  response: {
    201: z.object({
      message: z.string(),
      user: z.object({
        id: z.number(),
        name: z.string(),
        email: z.string(),
        role: z.enum(["ADMIN", "EDITOR"]),
      }),
    }),
    400: ErrorSchema,
    409: ErrorSchema,
    500: ErrorSchema,
  },
};

export const loginSchema = {
  description: "Login de usuário",
  summary: "Login de usuário",
  tags: ["Usuário"],
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
  response: {
    200: z.object({
      token: z.string(),
      refreshToken: z.string(),
      user: z.object({
        id: z.number(),
        name: z.string(),
        email: z.string(),
        role: z.enum(["ADMIN", "EDITOR"]),
      }),
    }),
    401: ErrorSchema,
    500: ErrorSchema,
  },
};

export const refreshSchema = {
  description: "Renovar o access token",
  summary: "Refresh Token",
  tags: ["Autenticação"],
  body: z.object({
    refreshToken: z.string(),
  }),
  response: {
    200: z.object({
      token: z.string(),
    }),
    401: ErrorSchema,
    500: ErrorSchema,
  },
};
