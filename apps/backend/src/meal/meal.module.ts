import { Module } from "@nestjs/common";
import { MealService } from "./meal.service";
import { Meal } from "./meal.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MealController } from "./meal.controller";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [TypeOrmModule.forFeature([Meal]), AuthModule],
  providers: [MealService],
  exports: [MealService],
  controllers: [MealController],
})
export class MealModule {}
