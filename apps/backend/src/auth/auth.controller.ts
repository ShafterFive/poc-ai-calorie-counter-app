import { Body, Controller, Get, Post, Req, Res } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger";
import type { Response, Request } from "express";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @ApiOperation({ summary: "Login user and set session token" })
  @ApiBody({
    description: "User login credentials",
    type: Object,
    schema: {
      properties: {
        email: { type: "string", example: "user@example.com" },
        password: { type: "string", example: "password123" },
      },
    },
  })
  @ApiResponse({ status: 200, description: "Login successful" })
  @ApiResponse({ status: 401, description: "Invalid credentials" })
  async login(
    @Body() body: { email: string; password: string },
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.login(
      body.email,
      body.password,
      typeof req.headers["x-forwarded-for"] === "string" ? req.headers["x-forwarded-for"] : "0.0.0.0",
    );

    res.cookie("SESSION_TOKEN", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000,
    });

    res.send({ success: true });
  }

  @Post("logout")
  @ApiOperation({ summary: "Logout user and clear session token" })
  @ApiResponse({ status: 200, description: "Logout successful" })
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    if (typeof req.cookies.SESSION_TOKEN === "string") {
      await this.authService.logout(req.cookies.SESSION_TOKEN);
    }

    res.clearCookie("SESSION_TOKEN");
    res.send({ success: true });
  }

  @Post("register")
  @ApiOperation({ summary: "Register a new user" })
  @ApiBody({
    description: "User registration details",
    type: Object,
    schema: {
      properties: {
        email: { type: "string", example: "user@example.com" },
        password: { type: "string", example: "password123" },
        name: { type: "string", example: "John Doe" },
      },
    },
  })
  @ApiResponse({ status: 200, description: "Registration successful" })
  @ApiResponse({ status: 400, description: "Invalid data" })
  async register(
    @Body() body: { email: string; password: string; name: string },
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.register(body.email, body.password, body.name);
    res.send({ success: true });
  }

  @Get("me")
  @ApiOperation({ summary: "Get current user information" })
  @ApiResponse({ status: 200, description: "User information retrieved successfully" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async getMe(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    if (typeof req.cookies.SESSION_TOKEN !== "string") {
      res.status(401).send({ success: false, message: "Unauthorized" });
      return;
    }
    const user = await this.authService.getMe(req.cookies.SESSION_TOKEN);
    if (!user) {
      res.status(401).send({ success: false, message: "Unauthorized" });
      return;
    }
    res.send({ user });
  }
}
