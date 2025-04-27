import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import { AppController } from "./app.controller";
import { UserModule } from "./user/user.module";
import { User } from "./user/user.entity";
import { Meal } from "./meal/meal.entity";
import { AiResponse } from "./ai-response/ai-response.entity";
import { AiInput } from "./ai-input/ai-input.entity";
import { Session } from "./session/session.entity";
import { AuthModule } from "./auth/auth.module";
import { AiModule } from "./ai/ai.module";
import { AiInputModule } from "./ai-input/ai-input.module";
import { AiResponseModule } from "./ai-response/ai-response.module";
import { MealModule } from "./meal/meal.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ["./.env"],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => ({
        type: "mysql",
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT ?? "3306"),
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        entities: [User, Meal, Session, AiResponse, AiInput],
        synchronize: process.env.NODE_ENV !== "production",
      }),
    }),
    MealModule,
    UserModule,
    AuthModule,
    AiInputModule,
    AiResponseModule,
    AiModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
