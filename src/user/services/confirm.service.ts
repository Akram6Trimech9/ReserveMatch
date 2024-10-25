import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';
import { MailService } from './mail.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ResendDto } from '../dto/resend.dto';
 
@Injectable()
export class ConfirmEmailService {
  constructor(
     @InjectRepository(User)
    private usersRepository: Repository<User>,
    private userService: UserService,
    private jwtService: JwtService,
     private emailService: MailService
  ) { }


  async confirmEmail(email: string) :Promise<any>{
    const user = await this.usersRepository.findOneBy({email: email });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    if (user.isEmailConfirmed) {
      throw new BadRequestException('Email already confirmed');
    }
    user.isEmailConfirmed = true;

    await this.usersRepository.save(user);
    
    return this.userService.login(user)
  }


  async decodeConfirmationToken(token: string) {
    try {
      console.log('Decoding token:', token);
  
      const payload = await this.jwtService.verify(token, {
        secret: process.env.AT_SECRET,
      });
  
   
      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }
  
      throw new BadRequestException('Invalid token payload');
    } catch (error) {
      console.error('Token verification error:', error);
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      }
      throw new BadRequestException('Bad confirmation token');
    }
  }
  
  public async resendConfirmationLink(resendData: ResendDto) {
    const {email} = resendData
    const user = await this.usersRepository.findOneBy({ email });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    if (user.isEmailConfirmed) {
      throw new BadRequestException('Email already confirmed');
    }

     const newToken = await this.jwtService.signAsync({ email: user.email }, {
      secret: process.env.AT_SECRET,
      expiresIn: '1h',  
    });

    await this.emailService.sendUserWelcome(user.email, newToken);
  }



}