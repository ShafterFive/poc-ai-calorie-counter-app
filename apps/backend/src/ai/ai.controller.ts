import { Controller, Post, Body, UseGuards, InternalServerErrorException, Req } from "@nestjs/common";
import { AiService } from "./ai.service";
import { MealService } from "../meal/meal.service";
import { AuthGuard } from "../auth/auth.guard";
import type { Request } from "express";
import { AuthService } from "src/auth/auth.service";
import { ApiOperation } from "@nestjs/swagger";

@Controller("ai")
export class AiController {
  constructor(
    private readonly aiService: AiService,
    private readonly mealService: MealService,
    private readonly authService: AuthService,
  ) {}

  @Post("analyze")
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: "Analyze food description and create a meal " })
  async analyzeFood(@Body() body: { description: string; name: string }, @Req() request: Request) {
    if (typeof request.cookies["SESSION_TOKEN"] !== "string") {
      throw new InternalServerErrorException("No session token found.");
    }

    const user = await this.authService.validateSession(request.cookies["SESSION_TOKEN"]);

    try {
      const { aiResponse } = await this.aiService.analyzeFood(user, body.description);
      const meal = await this.mealService.createMealFromAi(user, aiResponse, body.name);

      delete meal.user;

      return { meal };
    } catch (error) {
      console.error("Error analyzing food:", error);

      throw new InternalServerErrorException(
        error instanceof Error ? `Failed to analyze food: ${error.message}` : "Unknown error",
      );
    }
  }
}
