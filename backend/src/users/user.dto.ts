import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNotIn,
  Length,
} from "class-validator";
import * as PasswordValidator from 'password-validator';

export class UserDto {
  public static readonly passwordScheme = new PasswordValidator();
  static {
    UserDto.passwordScheme
      .has().uppercase()
      .has().lowercase()
      .has().digits(2)
      .has().not().spaces()
      .is().not().oneOf(['Passw0rd', 'Password123']);
  }

  @IsEmail()
  @IsOptional()
  // @IsNotEmpty({ message: 'You must have a email' })
  email?: string;
  

  @IsString()
  @IsNotEmpty({ message: 'Password cannot be empty' })
  @Length(8, 20, { message: 'Password should contains 8 character minimum' })
  @IsNotIn(['Passw0rd', 'Password123'])
  password: string;


  @IsString()
  @IsNotEmpty({ message: 'You must have a email' })
  username: string;
}