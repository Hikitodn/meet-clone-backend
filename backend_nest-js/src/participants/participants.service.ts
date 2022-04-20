import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { Participant } from './entities/participant.entity';

@Injectable()
export class ParticipantsService {
  constructor(
    @InjectRepository(Participant)
    private readonly participantsRepository: Repository<Participant>,
  ) {}

  async create(
    createParticipantDto: CreateParticipantDto,
  ): Promise<Participant> {
    return await this.participantsRepository.save({
      user_id: createParticipantDto.user_id,
      room_id: createParticipantDto.room_id,
    });
  }

  async findAll(): Promise<Participant[]> {
    return await this.participantsRepository.find();
  }

  async findOne(id: string): Promise<Participant> {
    return await this.participantsRepository.findOne(id);
  }

  async findOneOptions(
    options: FindOneOptions<Participant>,
  ): Promise<Participant> {
    return await this.participantsRepository.findOne(options);
  }

  async findByUserId(user_id: string): Promise<Participant> {
    return await this.participantsRepository.findOne({
      user_id: user_id,
    });
  }
}
