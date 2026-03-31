import { prisma } from "@/server/db";
import { LoginDto, RegisterDto } from "./auth.dto";
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

  static async login(dto: LoginDto) {
    const user = await prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new AppError("Invalid credentials", "UNAUTHORIZED");

    const isPasswordValid = await AuthUtils.comparePassword(user.password, dto.password);
    if (!isPasswordValid) throw new AppError("Invalid credentials", "UNAUTHORIZED");

    const token = await AuthUtils.generateToken(user.id);
    return token;
  }
}
