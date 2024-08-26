import { Controller, Get, Post, Body, Patch, Param, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('me')
  getMe(@Req() req) {
    return this.usersService.findOne(req.user.userId);
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
  getUser(@Param('username') username: string) {
    return this.usersService.findByUsername(username);
  }

  @Get(':username/wishes')
  async getWishes(@Param('username') username: string) {
    const { id } = await this.usersService.findByUsername(username);
    return this.usersService.getWishes(id);
  }
}
