import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOne(id: number) {
    const user = await this.usersRepository.findOneBy({ id });

    return user;
  }

  findOneQuery(query: FindOneOptions<User>) {
    return this.usersRepository.findOneOrFail(query);
  }

  async create(createUserDto: CreateUserDto) {
    const password = await bcrypt.hash(createUserDto.password, 10);
    const user = this.usersRepository.create({ ...createUserDto, password });

    return this.usersRepository.save(user);
  }

  async findByUsername(username: string) {
    const user = await this.usersRepository.findOneBy({ username });

    return user;
  }

  async getWishes(id: number) {
    const user = await this.usersRepository.findOneBy({ id });

    return user.wishes;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return this.usersRepository.update({ id }, updateUserDto);
  }
}
