import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions, FindManyOptions } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { FindByEmailOrCreateUserDto } from './dto/find-by-email-or-create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.usersRepository.save({
      name: createUserDto.name,
      email: createUserDto.email,
      picture: createUserDto.picture,
    });
    return user;
  }

  async findByEmailOrCreate(
    findByEmailOrCreateUserDto: FindByEmailOrCreateUserDto,
  ): Promise<User> {
    const user = await this.usersRepository.findOne({
      email: findByEmailOrCreateUserDto.email,
    });
    if (user) return user;
    return await this.usersRepository.save(findByEmailOrCreateUserDto);
  }

  async findById(id: string): Promise<User> {
    return await this.usersRepository.findOne(id);
  }

  async findByEmail(email: string): Promise<User> {
    return await this.usersRepository.findOne({ email });
  }

  async findOneOptions(options: FindOneOptions) {
    return await this.usersRepository.findOne(options);
  }

  async findManyOptions(options: FindManyOptions) {
    return await this.usersRepository.find(options);
  }
}
