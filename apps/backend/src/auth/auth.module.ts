import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { AuthGuard } from "./auth.guard";
import { Session } from "../session/session.entity";
import { UserModule } from "../user/user.module";
import { UserService } from "src/user/user.service";
import { SessionService } from "src/session/session.service";
import { User } from "src/user/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Session, User]), UserModule],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, UserService, SessionService],
  exports: [AuthGuard, AuthService],
})
export class AuthModule {}
