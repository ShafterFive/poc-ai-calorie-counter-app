import { Module } from "@nestjs/common";
import { MealService } from "./meal.service";
import { Meal } from "./meal.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([Meal])],
  providers: [MealService],
  exports: [MealService],
})
export class MealModule {}
