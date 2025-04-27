import { Module } from "@nestjs/common";
import { AiService } from "./ai.service";
import { AiController } from "./ai.controller";
import { AiInputModule } from "src/ai-input/ai-input.module";
import { AiResponseModule } from "src/ai-response/ai-response.module";
import { MealModule } from "src/meal/meal.module";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [AiInputModule, AiResponseModule, MealModule, AuthModule],
  providers: [AiService],
  controllers: [AiController],
})
export class AiModule {}
