import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, BeforeInsert } from "typeorm";
import { User } from "../user/user.entity";

@Entity()
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @Column({ type: "timestamp" })
  expiresAt: Date;

  @Column()
  ipAddress: string;

  @Column()
  token: string;

  @ManyToOne(() => User, (user) => user.sessions, { onDelete: "CASCADE" })
  user: User;

  @BeforeInsert()
  setExpiresAt() {
    if (!this.expiresAt) {
      this.expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour later
    }
  }
}
