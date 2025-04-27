import { Injectable } from "@nestjs/common";
import { AiInput } from "./ai-input.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class AiInputService {
  constructor(
    @InjectRepository(AiInput)
    private readonly usersRepository: Repository<AiInput>,
  ) {}

  async create(input: string): Promise<AiInput> {
    const aiInput = this.usersRepository.create({
      text: input,
    });
    return this.usersRepository.save(aiInput);
  }
}
