import { prisma } from "@/server/db";
import { RegisterDto } from "./auth.dto";
import { AppError } from "@/server/utils/app.error";
import { AuthUtils } from "./auth.utils";

export class AuthService {
  static async register(dto: RegisterDto) {
    const isUserExist = await prisma.user.findUnique({ where: { email: dto.email } });
    if (isUserExist) throw new AppError("User already exists", "CONFLICT");

    const hashedPassword = await AuthUtils.hashPassword(dto.password);
    const newUser = await prisma.user.create({
      data: {
        ...dto,
        password: hashedPassword,
      },
      select: {
        id: true,
      },
    });

    return newUser;
  }
}
