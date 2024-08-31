import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Req,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUsersDto } from './dto/find-users.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Like } from 'typeorm';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  // @HttpCode(201) by default
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req) {
    return await this.usersService.findOne(req.user.userId);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  async updateMe(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(req.user.userId, updateUserDto);
  }

  @Get('me/wishes')
  @UseGuards(JwtAuthGuard)
  async getMyWishes(@Req() req) {
    const user = await this.usersService.findOneQuery({
      where: req.user.userId,
      relations: ['wishes'],
    });
    return user?.wishes ?? [];
  }

  @Get(':username')
  @UseGuards(JwtAuthGuard)
  async getUser(@Param('username') username: string) {
    return await this.usersService.findByUsername(username);
  }

  @Get(':username/wishes')
  @UseGuards(JwtAuthGuard)
  async getWishes(@Param('username') username: string) {
    const { id } = await this.usersService.findByUsername(username);
    return this.usersService.getWishes(id);
  }

  @Post('find')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async findMany(@Body() { query }: FindUsersDto) {
    return await this.usersService.findManyQuery({
      where: [{ username: Like(`%${query}%`) }, { email: Like(`%${query}%`) }],
    });
  }
}
