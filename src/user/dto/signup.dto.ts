import { 
    IsEmail, 
    IsEnum, 
    IsNotEmpty, 
    IsOptional, 
    IsPhoneNumber, 
    IsString, 
    IsDate, 
    Length, 
    Matches
  } from 'class-validator';
  import { ApiProperty } from '@nestjs/swagger';
  import { Gender } from '../enums/Gender';
import { Role } from '../enums/Role';
  
  export class SignUpDto {
    
    @ApiProperty({ description: 'The user\'s first name', minLength: 2, maxLength: 50 })
    @IsNotEmpty()
    @IsString()
    @Length(2, 50)
    firstName: string;
  
    @ApiProperty({ description: 'The user\'s last name', minLength: 2, maxLength: 50 })
    @IsNotEmpty()
    @IsString()
    @Length(2, 50)
    lastName: string;
  
    @ApiProperty({ description: 'The user\'s email address' })
    @IsNotEmpty()
    @IsEmail()
    email: string;
  
    @ApiProperty({ description: 'The user\'s gender', enum: Gender })
    @IsEnum(Gender)
    gender: Gender;

      
    @ApiProperty({ description: 'The user\'s role', enum: Role })
    @IsEnum(Role)
    role: Role;
  
  
    @ApiProperty({ description: 'The user\'s date of birth' })
    @IsNotEmpty()
     dateOfBirth: Date;
  
    @ApiProperty({ description: 'The user\'s phone number', required: false })
    @IsOptional()
    @IsPhoneNumber(null)  
    phoneNumber?: string;
  
    @ApiProperty({ description: 'The URL of the user\'s profile image', required: false })
    @IsOptional()
    @IsString()
    image?: string;
  
 
  
    @ApiProperty({ description: 'The user\'s password', minLength: 6 })
    @IsNotEmpty()
    @IsString()
    @Length(6, 100)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*.,?])[A-Za-z\d!@#$%^&*.,?]{6,}$/, 
             { message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (e.g., . ?)!' })
    password: string;

    @ApiProperty({ description: 'The user\'s country' })
    @IsNotEmpty()
    @IsString()
    @Length(2, 50)
    country: string;
  
    @ApiProperty({ description: 'The user\'s address' })
    @IsNotEmpty()
    @IsString()
    @Length(5, 100)
    address: string;
  }
  