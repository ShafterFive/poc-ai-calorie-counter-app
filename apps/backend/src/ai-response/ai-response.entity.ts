import { Column, Entity, PrimaryGeneratedColumn, BeforeUpdate, OneToOne } from "typeorm";
import { AiInput } from "../ai-input/ai-input.entity";
import { Meal } from "../meal/meal.entity";

@Entity()
export class AiResponse {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "json" })
  json: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @OneToOne(() => Meal, (meal) => meal.aiResponse)
  meal: Meal;

  @OneToOne(() => AiInput, (input) => input.response)
  input: AiInput;

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = new Date();
  }
}
