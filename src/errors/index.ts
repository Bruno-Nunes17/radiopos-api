export class NotFoundError extends Error {
  public code = "NOT_FOUND";
  constructor(message: string) {
    super(message || "Recurso não encontrado");
    this.name = "NotFoundError";
  }
}

export class UnauthorizedError extends Error {
  public code = "UNAUTHORIZED";
  constructor(message: string) {
    super(message || "Token JWT inválido ou ausente");
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends Error {
  public code = "FORBIDDEN";
  constructor(message: string) {
    super(message || "Token válido mas sem permissão");
    this.name = "ForbiddenError";
  }
}

export class InvalidApiKeyError extends Error {
  public code = "INVALID_API_KEY";
  constructor(message: string) {
    super(message || "X-API-Key ausente ou inválida");
    this.name = "InvalidApiKeyError";
  }
}

export class ConflictError extends Error {
  public code = "CONFLICT";
  constructor(message: string) {
    super(message || "Violação de unique constraint");
    this.name = "ConflictError";
  }
}

export class ValidationError extends Error {
  public code = "VALIDATION_ERROR";
  constructor(message: string) {
    super(message || "Dados inválidos que escaparam do schema Zod");
    this.name = "ValidationError";
  }
}
