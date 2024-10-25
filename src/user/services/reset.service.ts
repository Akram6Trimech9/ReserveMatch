import { BadRequestException, Injectable } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { ForgotPasswordDTO } from "../dto/forget-password.dto";
import { MailService } from "./mail.service";
import { UserService } from "./user.service";
 import { UpdateUserModuleDto } from "../dto/update-user-module.dto"; // Import your update DTO
import { changePasswordDto } from "../dto/change-password.dto";
import passport from "passport";
import { ApiRes } from "../dto/ApiResponse.dto";

@Injectable()
export class ResetPasswordService {
    constructor(
        private readonly userService: UserService,
        private readonly mailService: MailService
    ) {}

    async forgotPassword(forgotPasswordDto: ForgotPasswordDTO): Promise<ApiRes<void>> {
        const user = await this.userService.findByEmail(forgotPasswordDto.email);
        if (!user) {
            throw new BadRequestException(new ApiRes(false, 'Invalid email'));
        }
        const resetToken = await this.userService.createPasswordResetToken(user.id);
        await this.mailService.forgotpass(user, resetToken);
        return new ApiRes(true, 'Password reset email sent successfully');
    }
    

    async changePassword(changeDto: changePasswordDto): Promise<ApiRes<boolean>> {
        const {email , password} = changeDto
        const user = await this.userService.findByEmail(email);
        if (!user) {
            throw new BadRequestException('Invalid email');
        }
          const updateUserDto = new UpdateUserModuleDto(); 
         updateUserDto.password = password;
         await this.userService.update(user.id, updateUserDto);
         return new ApiRes(true, 'Password changed successfully');
    }
}
