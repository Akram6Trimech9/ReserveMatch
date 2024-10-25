import { 
    IsEmail, 
    IsEnum, 
    IsNotEmpty, 
    IsOptional, 
    IsPhoneNumber, 
    IsString, 
    IsDate, 
    Length 
  } from 'class-validator';
  import { ApiProperty } from '@nestjs/swagger';
  import { Gender } from '../enums/Gender';
import { Role } from '../enums/Role';
  
  export class CreateUserModuleDto {
    
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
  
    @ApiProperty({ description: 'Whether the user has confirmed their email address', default: false })
    @IsNotEmpty()
    isEmailConfirmed: boolean;
  
    @ApiProperty({ description: 'The user\'s password', minLength: 6 })
    @IsNotEmpty()
    @IsString()
    @Length(6, 100)  
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
  