import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { Matches as MatchField } from 'class-validator-matches';

export class SignUpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  @Matches(
    /^(?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{":;'?/>,.<])(?!.*\s).{8,}$/,
    {
      message:
        'Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.',
    },
  )
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MatchField('password', { message: 'Password confirmation does not match' })
  passwordConfirm: string;
}
