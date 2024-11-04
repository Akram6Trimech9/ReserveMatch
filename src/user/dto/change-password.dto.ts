import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class changePasswordDto {
    
    @ApiProperty({
        description: 'The new password for the user',
        example: 'P@ssw0rd123',
    })
    @IsString()
    @IsNotEmpty()
    readonly password: string;  
}
