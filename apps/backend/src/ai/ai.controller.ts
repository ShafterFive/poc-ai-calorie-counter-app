import { Controller, Post, Body, UseGuards, InternalServerErrorException, Req } from "@nestjs/common";
import { AiService } from "./ai.service";
import { MealService } from "../meal/meal.service";
import { AuthGuard } from "../auth/auth.guard";
import type { Request } from "express";
import { AuthService } from "src/auth/auth.service";
import { ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger";

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
  @ApiBody({
    description: "Food description and meal name",
    type: Object,
    schema: {
      properties: {
        description: { type: "string", example: "100g of spagetti with 30g of sugar free tomato sauce" },
        name: { type: "string", example: "Pasta at dinner" },
      },
    },
    examples: {
      example: {
        value: {
          description: "100g of spagetti with 30g of sugar free tomato sauce",
          name: "Pasta at dinner",
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "Meal created successfully",
    schema: {
      type: "object",
      properties: {
        meal: {
          properties: {
            id: { type: "number", example: 1 },
            name: { type: "string", example: "Pasta at dinner" },
            calories: { type: "number", example: 300 },
            protein: { type: "number", example: 10 },
            carbohydrates: { type: "number", example: 50 },
            fats: { type: "number", example: 5 },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 500, description: "Internal server error" })
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
