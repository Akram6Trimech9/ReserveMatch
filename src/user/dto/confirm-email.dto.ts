import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConfirmEmailDto {
  @ApiProperty({
    description: 'The confirmation token sent to the user for email verification',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  token: string;
}

export default ConfirmEmailDto;
