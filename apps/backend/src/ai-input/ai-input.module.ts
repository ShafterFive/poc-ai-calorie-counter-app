import { Module } from "@nestjs/common";
import { AiInputService } from "./ai-input.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AiInput } from "./ai-input.entity";

@Module({
  imports: [TypeOrmModule.forFeature([AiInput])],
  providers: [AiInputService],
  exports: [AiInputService],
})
export class AiInputModule {}
