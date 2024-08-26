import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsEmail()
  email: string;
  @IsString()
  password: string;
  @IsString()
  @Length(10, 20)
  username: string;
  @IsUrl()
  @IsOptional()
  avatar?: string;
  @Length(2, 200)
  @IsOptional()
  about?: string;
}
