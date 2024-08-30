import { IsEmail, IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;
  @IsString()
  password: string;
  @IsString()
  @Length(2, 30)
  username: string;
  @IsUrl()
  @IsOptional()
  avatar?: string;
  @Length(2, 200)
  @IsOptional()
  about?: string;
}
