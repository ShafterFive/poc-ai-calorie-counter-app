import { Injectable } from "@nestjs/common";
import { AiInput } from "../ai-input/ai-input.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { AiResponse } from "./ai-response.entity";

@Injectable()
export class AiResponseService {
  constructor(
    @InjectRepository(AiResponse)
    private readonly aiInputRepository: Repository<AiResponse>,
  ) {}

  async create(output: string, aiInput: AiInput) {
    const aiResponse = this.aiInputRepository.create({
      json: output,
      input: aiInput,
    });
    return this.aiInputRepository.save(aiResponse);
  }
}
