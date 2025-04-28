import { Controller, Delete, Get, InternalServerErrorException, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.guard";
import { MealService } from "./meal.service";
import { AuthService } from "../auth/auth.service";
import type { Request } from "express";

@Controller("meal")
export class MealController {
  constructor(
    private readonly mealService: MealService,
    private readonly authService: AuthService,
  ) {}

  @Get("today")
  @UseGuards(AuthGuard)
  async getTodayMeals(@Req() request: Request) {
    if (typeof request.cookies["SESSION_TOKEN"] !== "string") {
      throw new InternalServerErrorException("No session token found.");
    }
    const user = await this.authService.getMe(request.cookies.SESSION_TOKEN);

    try {
      const meals = await this.mealService.getTodayMeals(user);
      return { meals };
    } catch (error) {
      console.error("Error fetching today's meals:", error);
      throw new InternalServerErrorException(
        error instanceof Error ? `Failed to fetch today's meals: ${error.message}` : "Unknown error",
      );
    }
  }

  @Get("history")
  @UseGuards(AuthGuard)
  async getHistory(@Req() request: Request) {
    if (typeof request.cookies["SESSION_TOKEN"] !== "string") {
      throw new InternalServerErrorException("No session token found.");
    }
    const user = await this.authService.getMe(request.cookies.SESSION_TOKEN);

    try {
      const meals = await this.mealService.getHistory(user);
      return { meals };
    } catch (error) {
      console.error("Error fetching meal history:", error);
      throw new InternalServerErrorException(
        error instanceof Error ? `Failed to fetch meal history: ${error.message}` : "Unknown error",
      );
    }
  }

  @Get("today/calories")
  @UseGuards(AuthGuard)
  async getTodayCalories(@Req() request: Request) {
    if (typeof request.cookies["SESSION_TOKEN"] !== "string") {
      throw new InternalServerErrorException("No session token found.");
    }
    const user = await this.authService.getMe(request.cookies.SESSION_TOKEN);

    try {
      const calories = await this.mealService.getTodayCalories(user);
      return { calories };
    } catch (error) {
      console.error("Error fetching today's calories:", error);
      throw new InternalServerErrorException(
        error instanceof Error ? `Failed to fetch today's calories: ${error.message}` : "Unknown error",
      );
    }
  }

  @Get("weekly/average")
  @UseGuards(AuthGuard)
  async getWeeklyAverage(@Req() request: Request) {
    if (typeof request.cookies["SESSION_TOKEN"] !== "string") {
      throw new InternalServerErrorException("No session token found.");
    }
    const user = await this.authService.getMe(request.cookies.SESSION_TOKEN);

    try {
      const average = await this.mealService.getWeeklyAverage(user);
      return { average };
    } catch (error) {
      console.error("Error fetching weekly average calories:", error);
      throw new InternalServerErrorException(
        error instanceof Error ? `Failed to fetch weekly average calories: ${error.message}` : "Unknown error",
      );
    }
  }

  @Delete(":id")
  @UseGuards(AuthGuard)
  async deleteMeal(@Req() request: Request) {
    if (typeof request.cookies["SESSION_TOKEN"] !== "string") {
      throw new InternalServerErrorException("No session token found.");
    }
    const user = await this.authService.getMe(request.cookies.SESSION_TOKEN);

    try {
      const mealId = parseInt(request.params.id, 10);
      await this.mealService.deleteMeal(user, mealId);
      return { message: "Meal deleted successfully" };
    } catch (error) {
      console.error("Error deleting meal:", error);
      throw new InternalServerErrorException(
        error instanceof Error ? `Failed to delete meal: ${error.message}` : "Unknown error",
      );
    }
  }
}
