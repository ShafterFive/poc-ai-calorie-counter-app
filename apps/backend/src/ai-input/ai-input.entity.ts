import { Column, Entity, PrimaryGeneratedColumn, BeforeUpdate, OneToOne, JoinColumn } from "typeorm";
import { AiResponse } from "../ai-response/ai-response.entity";

@Entity()
export class AiInput {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @OneToOne(() => AiResponse, (response) => response.input, {
    nullable: true,
    cascade: true,
  })
  @JoinColumn()
  response: AiResponse;

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = new Date();
  }
}
