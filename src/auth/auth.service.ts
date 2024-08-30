import { User } from 'src/users/entities/user.entity';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { verifyHash } from 'src/helpers/hash';
import { SigninUserDto } from './dto/signup-user.dto';
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findOneQuery({
      select: { username: true, password: true, id: true },
      where: { username },
    });

    if (!user || !(await verifyHash(password, user.password))) {
      throw new UnauthorizedException('Неправильный логин или пароль');
    }
    return user;
  }

  async login({ username, password }: SigninUserDto) {
    const { id: sub } = await this.validateUser(username, password);
    return {
      access_token: await this.jwtService.signAsync({
        username: username,
        sub: sub,
      }),
    };
  }
}
