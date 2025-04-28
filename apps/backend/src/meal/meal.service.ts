import { Injectable } from "@nestjs/common";
import { Meal } from "./meal.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Between, Repository } from "typeorm";
import { AiResponse } from "src/ai-response/ai-response.entity";
import { User } from "src/user/user.entity";

@Injectable()
export class MealService {
  constructor(
    @InjectRepository(Meal)
    private readonly mealRepo: Repository<Meal>,
  ) {}

  async createMealFromAi(user: User, aiResponse: AiResponse, name: string) {
    const parsed = this.extractMealData(aiResponse.json);

    const meal = this.mealRepo.create({
      user,
      name,
      calories: parsed.calories,
      protein: parsed.proteins,
      carbohydrates: parsed.carbohydrates,
      fats: parsed.fats,
      aiResponse,
    });

    return this.mealRepo.save(meal);
  }

  private extractMealData(aiText: string): {
    calories: number;
    proteins: number;
    carbohydrates: number;
    fats: number;
  } {
    let safeAiText = aiText;
    if (safeAiText.startsWith("```json")) {
      safeAiText = safeAiText.slice(7);
    }
    if (safeAiText.endsWith("```")) {
      safeAiText = safeAiText.slice(0, -3);
    }

    safeAiText = safeAiText.trim();

    try {
      const data = JSON.parse(safeAiText) as object;

      if (
        typeof data !== "object" ||
        typeof data["calories"] !== "number" ||
        typeof data["proteins"] !== "number" ||
        typeof data["carbohydrates"] !== "number" ||
        typeof data["fats"] !== "number"
      ) {
        throw new Error("Invalid AI response format.");
      }

      const { calories, proteins, carbohydrates, fats } = data as {
        calories: number;
        proteins: number;
        carbohydrates: number;
        fats: number;
      };

      return {
        calories,
        proteins,
        carbohydrates,
        fats,
      };
    } catch (err) {
      console.error("Error parsing AI response:", err);
      throw new Error("Ai response is not valid JSON");
    }
  }

  async getTodayMeals(user: User): Promise<Meal[]> {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    return this.mealRepo.find({
      where: {
        user,
        createdAt: Between(startOfDay, endOfDay),
      },
    });
  }

  async getHistory(user: User): Promise<Meal[]> {
    return this.mealRepo.find({
      where: {
        user,
      },
      order: {
        createdAt: "DESC",
      },
      take: 20,
    });
  }

  async getTodayCalories(user: User): Promise<number> {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const meals = await this.mealRepo.find({
      where: {
        user,
        createdAt: Between(startOfDay, endOfDay),
      },
    });

    return meals.reduce((total, meal) => total + meal.calories, 0);
  }

  async getWeeklyAverage(user: User): Promise<number> {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));

    const meals = await this.mealRepo.find({
      where: {
        user,
        createdAt: Between(startOfWeek, endOfWeek),
      },
    });

    const totalCalories = meals.reduce((total, meal) => total + meal.calories, 0);
    return totalCalories / meals.length || 0;
  }

  async deleteMeal(user: User, id: number) {
    const meal = await this.mealRepo.findOne({
      where: {
        id,
        user,
      },
    });

    if (!meal) {
      throw new Error("Meal not found");
    }

    await this.mealRepo.remove(meal);
  }
}
