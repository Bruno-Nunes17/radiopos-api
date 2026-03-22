import bcrypt from "bcrypt";
import { prisma } from "../lib/db.js";
import { ConflictError } from "../errors/index.js";
import { Role } from "../generated/prisma/enums.js";

interface RegisterInputDto {
  name: string;
  email: string;
  password: string;
}

interface RegisterOutputDto {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export class RegisterUser {
  async execute(dto: RegisterInputDto): Promise<RegisterOutputDto> {
    const userExists = await prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (userExists) {
      throw new ConflictError("E-mail já cadastrado");
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const lastUser = await prisma.user.findFirst({
      orderBy: { id: "desc" },
    });

    const nextId = (lastUser?.id || 0) + 1;

    const user = await prisma.user.create({
      data: {
        id: nextId,
        name: dto.name,
        email: dto.email,
        password: passwordHash,
      },
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }
}
