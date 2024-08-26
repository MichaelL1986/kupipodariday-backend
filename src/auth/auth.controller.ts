import { CreateUserDto } from './../users/dto/create-user.dto';
import { Body, Controller, Post, Req } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { instanceToPlain } from 'class-transformer';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { SigninUserResponseDto } from './dto/signin-user.dto';
import { SigninUserDto } from './dto/signup-user.dto';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  login(@Body() signInUser: SigninUserDto): Promise<SigninUserResponseDto> {
    return this.authService.login(signInUser);
  }

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return instanceToPlain(user);
  }
}
