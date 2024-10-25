import { IsEmail, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ForgotPasswordDTO {
    @ApiProperty({
        description: 'The email address of the user requesting a password reset'
     })
    @IsNotEmpty()
    @IsEmail()
    email: string;
}
