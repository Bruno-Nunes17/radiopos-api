import bcrypt from "bcrypt";
import { prisma } from "../lib/db.js";
import { UnauthorizedError } from "../errors/index.js";
import { Role } from "../generated/prisma/enums.js";

interface LoginInputDto {
  email: string;
  password: string;
}

interface LoginOutputDto {
  user: {
    id: number;
    name: string;
    email: string;
    role: Role;
  };
}

export class LoginUser {
  async execute(dto: LoginInputDto): Promise<LoginOutputDto> {
    const user = await prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedError("Credenciais inválidas");
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError("Credenciais inválidas");
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
