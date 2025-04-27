import { Injectable } from "@nestjs/common";
import { Meal } from "./meal.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
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
}
