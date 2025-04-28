import { Injectable } from "@nestjs/common";
import { AiInputService } from "../ai-input/ai-input.service";
import { AiResponseService } from "../ai-response/ai-response.service";
import { generateText } from "ai";
import { mistral } from "@ai-sdk/mistral";
import { User } from "../user/user.entity";

@Injectable()
export class AiService {
  constructor(
    private readonly aiInputService: AiInputService,
    private readonly aiResponseService: AiResponseService,
  ) {}

  async analyzeFood(_: User, input: string) {
    const aiInput = await this.aiInputService.create(input);
    const res = await this.askAi(input);
    const aiResponse = await this.aiResponseService.create(res, aiInput);

    return { aiInput, aiResponse };
  }

  private async askAi(input: string) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);

      const result = await generateText({
        model: mistral("mistral-large-latest"),
        temperature: 0.2,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `For the following meal: "${input}", provide only the following data in this exact format:
                { "calories": number, "proteins": number, "carbohydrates": number, "fats": number }
                Do not modify the output in any way. Consistency is key, and no other data should be included.`,
              },
            ],
          },
        ],
        abortSignal: controller.signal,
      });

      clearTimeout(timeout);

      if (!result.text) {
        throw new Error("Empty AI response");
      }

      const cleanResponse = result.text.replaceAll("```", "").replaceAll("json", "");

      return cleanResponse;
    } catch (error) {
      console.error("Error when calling AI:", error);
      throw new Error("Error when calling AI");
    }
  }
}
