import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserModuleDto } from '../dto/create-user-module.dto';
import { UpdateUserModuleDto } from '../dto/update-user-module.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { UserInterface } from '../user.interface';
import { SignUpDto } from '../dto/signup.dto';
import { SignInDto } from '../dto/signin.dto';

import { UserAlreadyExistException } from 'src/config/exceptions';
import * as bcrypt from 'bcrypt'
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload, Tokens } from '../types';
import { Role } from '../enums/Role';
import { MailService } from './mail.service';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<UserInterface>,
    private jwtService: JwtService,
    private config: ConfigService,
    private emailService: MailService,
  ) { }


  hashData(data: string) {
    return bcrypt.hash(data, 12)
  }

  async signup(signupData: SignUpDto): Promise<UserInterface> {
    const { email, password } = signupData;

     const emailInUse = await this.userRepository.findOneBy({ email });
    if (emailInUse) {
        throw new UserAlreadyExistException();
    }

     const hashedPassword = await this.hashData(password);

     const newUser = this.userRepository.create({
        ...signupData,
        password: hashedPassword,  
    });

     await this.userRepository.save(newUser);

    const tokens = await this.getTokens(newUser.id, newUser.email, newUser.role);
    await this.emailService.sendUserWelcome(newUser, tokens.access_token);
    await this.updateRefreshToken(newUser.id, tokens.refresh_token);

    return newUser;
}


  async updateRefreshToken(userId: string, refreshToken: string) {

    const hashedRefreshToken = await this.hashData(refreshToken);

    const user = await this.userRepository.findOneBy({ id: userId });

    user.refreshToken = hashedRefreshToken;

    await this.userRepository.save(user);
  }


  async getTokens(userId: string, email: string, role: Role): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email: email,
      role: role
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>('AT_SECRET'),
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>('RT_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }



  async login(payload: any): Promise<any> {
    const user = await this.userRepository.findOneBy({ id: payload.id })
    if (!user.isEmailConfirmed) {
      throw new BadRequestException('your email isn t confirmed yet ')
    }
    const tokens = await this.getTokens(payload.id, payload.email.toLowerCase(), payload.role);
    await this.updateRefreshToken(payload.id, tokens.refresh_token);
    return tokens;
  }


  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.findByEmail(email);
    if (user && (await this.passwordsAreEqual(user.password, pass))) {
      const { ...result } = user;

      return result;
    }
    return null;
  }
  private async passwordsAreEqual(hashedPassword: string, plainPassword: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    if (!isMatch) {
      throw new BadRequestException('Password is incorrect');
    }
    return true;
  }

 
 

  async findAll(): Promise<UserInterface[]> {
    return await this.userRepository.find();
  }


  async findOne(id: string): Promise<UserInterface> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }


  async findByEmail(email: string): Promise<UserInterface | undefined> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException('User does not exist');
    }
    return user;
  }
  

 
  async update(id: string, updateUserDto: UpdateUserModuleDto): Promise<UserInterface> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, updateUserDto);  

    if (updateUserDto.password) {
      user.password = await this.hashData(updateUserDto.password);
    }

    return await this.userRepository.save(user);
  }

  


  async remove(id: string): Promise<string> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.userRepository.remove(user);
    return 'User deleted';
  }


 
  async searchUsers(searchString: string): Promise<UserInterface[]> {
    const users = await this.userRepository.find();
    return users.filter(user => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      return (
        user.firstName.toLowerCase().includes(searchString) ||
        user.lastName.toLowerCase().includes(searchString) ||
        user.email.toLowerCase().includes(searchString) ||
        fullName.includes(searchString)
      );
    });
  }


  async findOneUser(userId: string): Promise<UserInterface> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
  
  async createPasswordResetToken(userId: string): Promise<string> {
    const user = await this.findOne(userId);
    if (!user) {
        throw new BadRequestException('User not found');
    }

    const payload = { sub: user.id, email: user.email };
    const token = await this.jwtService.signAsync(payload, {
        secret: this.config.get<string>('AT_SECRET'),  
        expiresIn: '1h', 
    });

    return token;
}

 

}
