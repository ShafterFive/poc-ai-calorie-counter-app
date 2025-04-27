import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Request } from "express";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    if (typeof request.cookies.SESSION_TOKEN !== "string") return false;

    const token = request.cookies.SESSION_TOKEN;
    if (!token) return false;

    const user = await this.authService.validateSession(token);
    if (!user) return false;

    return true;
  }
}
