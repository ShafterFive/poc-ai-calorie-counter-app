import { Module } from "@nestjs/common";
import { AiResponseService } from "./ai-response.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AiResponse } from "./ai-response.entity";

@Module({
  imports: [TypeOrmModule.forFeature([AiResponse])],
  providers: [AiResponseService],
  exports: [AiResponseService],
})
export class AiResponseModule {}
