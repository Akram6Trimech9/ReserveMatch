import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class changePasswordDto {
    
    @ApiProperty({
        description: 'The email of the user requesting the password change',
        example: 'user@example.com',
    })
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    readonly email: string; 

    @ApiProperty({
        description: 'The new password for the user',
        example: 'P@ssw0rd123',
    })
    @IsString()
    @IsNotEmpty()
    readonly password: string;  
}
