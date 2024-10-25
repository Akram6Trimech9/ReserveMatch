import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResendDto {
  @ApiProperty({
    description: 'The email address of the user to resend the confirmation link',
    type: String,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export default ResendDto;
