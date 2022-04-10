import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { Participant } from './entities/participant.entity';

@Injectable()
export class ParticipantService {
  constructor(
    @InjectRepository(Participant)
    private readonly participantRepository: Repository<Participant>,
  ) {}

  create(createParticipantDto: CreateParticipantDto) {
    return this.participantRepository.save({
      user_id: createParticipantDto.user_id,
      room_id: createParticipantDto.room_id,
    });
  }

  findAll() {
    return this.participantRepository.find();
  }

  findOne(id: number) {
    return this.participantRepository.findOne({ where: { id } });
  }
}
