import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { FindByEmailOrCreateUserDto } from './dto/find-by-email-or-create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.usersRepository.save({
      name: createUserDto.name,
      email: createUserDto.email,
      picture: createUserDto.picture,
    });
    return user;
  }

  async findByEmailOrCreate(
    findByEmailOrCreateUserDto: FindByEmailOrCreateUserDto,
  ) {
    const user = await this.usersRepository.findOne({
      where: { email: findByEmailOrCreateUserDto.email },
    });
    if (user) return user;
    return await this.usersRepository.save(findByEmailOrCreateUserDto);
  }

  async findAll() {
    return await this.usersRepository.find();
  }

  async findOne(id: string) {
    return await this.usersRepository.findOne(id);
  }

  async findByEmail(email: string) {
    return await this.usersRepository.findOne({ where: { email } });
  }
}
