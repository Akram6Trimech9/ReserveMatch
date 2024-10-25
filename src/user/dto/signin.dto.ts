import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty({
    description: 'The email address of the user for signing in',
    type: String,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'The password of the user for signing in',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export default SignInDto;
