import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { SessionService } from "../session/session.service";
import bcrypt from "bcrypt";
import { randomUUID } from "node:crypto";
import { User } from "src/user/user.entity";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly sessionService: SessionService,
  ) {}

  async login(email: string, password: string, ipAddress: string): Promise<string> {
    const user = await this.userService.findOneByEmail(email);
    if (!user) throw new UnauthorizedException("Invalid credentials");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException("Invalid credentials");

    const session = await this.sessionService.createSession(randomUUID(), user, ipAddress);

    return session.token;
  }

  async validateSession(token: string): Promise<User> {
    const session = await this.sessionService.findOneByToken(token);
    if (!session || session.expiresAt < new Date()) throw new UnauthorizedException("Invalid session");
    return session.user;
  }

  async logout(token: string) {
    await this.sessionService.deleteByToken(token);
    return true;
  }

  async register(email: string, password: string, name: string): Promise<User> {
    const existingUser = await this.userService.findOneByEmail(email);
    if (existingUser) {
      throw new UnauthorizedException("Email already exists");
    }
    return this.userService.create(email, password, name);
  }

  async getMe(token: string): Promise<User> {
    const session = await this.sessionService.findOneByToken(token);
    if (!session) throw new UnauthorizedException("Invalid session");
    return session.user;
  }
}
