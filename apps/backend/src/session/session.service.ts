import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Session } from "./session.entity";
import { Repository } from "typeorm";
import { User } from "../user/user.entity";

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}

  async createSession(token: string, user: User, ipAddress: string) {
    const session = this.sessionRepository.create({
      token,
      user,
      ipAddress,
    });

    return this.sessionRepository.save(session);
  }

  async findOneByToken(token: string): Promise<Session | null> {
    return this.sessionRepository.findOne({ where: { token }, relations: ["user"] });
  }

  async deleteByToken(token: string): Promise<void> {
    await this.sessionRepository.delete({ token });
  }
}
