import { IsEmail, IsString, Length } from 'class-validator';

export class FindUsersDto {
  @IsEmail()
  email: string;
  @IsString()
  @Length(10, 20)
  username: string;
}
