import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UsePipes, ValidationPipe, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AtGuard } from 'src/user/common/guards';
import { ApiRes } from 'src/user/dto/ApiResponse.dto';
 import { changePasswordDto } from 'src/user/dto/change-password.dto';
import ConfirmEmailDto from 'src/user/dto/confirm-email.dto';
import { ForgotPasswordDTO } from 'src/user/dto/forget-password.dto';
import ResendDto from 'src/user/dto/resend.dto';
import { SignUpDto } from 'src/user/dto/signup.dto';
import { ConfirmEmailService } from 'src/user/services/confirm.service';
import { ResetPasswordService } from 'src/user/services/reset.service';
import { UserService } from 'src/user/services/user.service';
import { Tokens } from 'src/user/types';
 

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly emailConfirmationService: ConfirmEmailService,
    private readonly  resetPasswordService: ResetPasswordService,

  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('local/signup')
  @UsePipes(ValidationPipe)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'User successfully registered.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Validation error.' })
  async signUp(@Body() signupData: SignUpDto) {
    return this.userService.signup(signupData);
  }

  @UseGuards(AuthGuard('local'))
  @Post('local/signin')
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User sign-in' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User successfully signed in.'  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid credentials.' })
  async signinLocal(@Request() req): Promise<Tokens> {
    return await this.userService.login(req.user);
  }

  @Post('/email/confirm')
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Confirm email address' })
  @ApiResponse({ status: HttpStatus.ACCEPTED, description: 'Email confirmed successfully.'  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid or expired token.' })
  async confirm(@Body() confirmationData: ConfirmEmailDto): Promise<Tokens> {
    const email = await this.emailConfirmationService.decodeConfirmationToken(confirmationData.token);
    return await this.emailConfirmationService.confirmEmail(email);
  }

  @Post('/email/resend-confirmation')
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Resend email confirmation link' })
  @ApiResponse({ status: HttpStatus.ACCEPTED, description: 'Confirmation link sent successfully.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Validation error or user not found.' })
  async resendConfirmation(@Body() resendData: ResendDto): Promise<ApiRes<void>> {
    await this.emailConfirmationService.resendConfirmationLink(resendData);
    return new ApiRes(true, 'Confirmation link sent successfully.');
  }

  @Post('/forgot-password')
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({ status: HttpStatus.ACCEPTED, description: 'Password reset email sent.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid email.' })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDTO): Promise<ApiRes<void>> {
      return await this.resetPasswordService.forgotPassword(forgotPasswordDto);
  }
  
  @UseGuards(AtGuard) 
  @Patch('/change-password')
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change user password' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Password changed successfully.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid email or other validation errors.' })
  async changePassword(@Body() changeDto: changePasswordDto): Promise<ApiRes<boolean>> {
      return await this.resetPasswordService.changePassword(changeDto);
  }
  
 }
