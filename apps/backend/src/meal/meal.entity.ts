import { Column, Entity, PrimaryGeneratedColumn, BeforeUpdate, ManyToOne, OneToOne, JoinColumn } from "typeorm";
import { MealEnum } from "./meal.enum";
import { User } from "../user/user.entity";
import { AiResponse } from "../ai-response/ai-response.entity";

@Entity()
export class Meal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  calories: number;

  @Column()
  protein: number;

  @Column()
  carbohydrates: number;

  @Column()
  fats: number;

  @ManyToOne(() => User, { nullable: false })
  user: User;

  @OneToOne(() => AiResponse, { nullable: true, cascade: true })
  @JoinColumn()
  aiResponse: AiResponse;

  @Column({
    type: "enum",
    enum: MealEnum,
  })
  type: MealEnum;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = new Date();
  }
}
