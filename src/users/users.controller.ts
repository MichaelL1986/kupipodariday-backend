import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Req,
  HttpCode,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUsersDto } from './dto/find-users.dto';
import { User } from './entities/user.entity';

const excludePassword = (user: User | User[]) => {
  if (Array.isArray(user)) {
    return user.map(({ password: _, ...other }) => other);
  } else {
    const { password: _, ...other } = user;
    return other;
  }
};

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  // @HttpCode(201) by default
  async create(@Body() createUserDto: CreateUserDto) {
    return excludePassword(await this.usersService.create(createUserDto));
  }

  @Get('me')
  async getMe(@Req() req) {
    return excludePassword(await this.usersService.findOne(req.user.userId));
  }

  @Patch('me')
  async updateMe(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(req.user.userId, updateUserDto);
  }

  @Get('me/wishes')
  async getMyWishes(@Req() req) {
    const user = await this.usersService.findOneQuery({
      where: req.user.userId,
      relations: ['wishes'],
    });
    return user?.wishes ?? [];
  }

  @Get(':username')
  async getUser(@Param('username') username: string) {
    return excludePassword(await this.usersService.findByUsername(username));
  }

  @Get(':username/wishes')
  async getWishes(@Param('username') username: string) {
    const { id } = await this.usersService.findByUsername(username);
    return this.usersService.getWishes(id);
  }

  @Post('find')
  @HttpCode(200)
  async findMany(@Body() { query }: FindUsersDto) {
    return excludePassword(
      // WHERE email = query OR username = query
      await this.usersService.findManyQuery({
        where: [{ email: query }, { username: query }],
      }),
    );
  }
}
