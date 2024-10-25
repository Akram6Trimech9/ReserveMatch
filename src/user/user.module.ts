import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
 import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AtStrategy, RtStrategy } from './strategies';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
 import { join } from 'path';
import { MailService } from './services/mail.service';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { ConfirmEmailService } from './services/confirm.service';
import { AuthController } from './controllers/auth/auth.controller';
import { ResetPasswordService } from './services/reset.service';
import { UserController } from './controllers/user/user.controller';
@Module({
  imports:[TypeOrmModule.forFeature([User]) ,
  JwtModule.register({}) ,
  MailerModule.forRootAsync({
    useFactory: (configService: ConfigService) => ({
    transport: {
      host:configService.get('MAIL_HOST') ,
      port:587,
      auth: {
        user: configService.get('MAIL_USER'),
        pass: configService.get('MAIL_PASS')
      }
    },
    defaults: {
      from: `"RESERVEMATCH" ${configService.get('MAIL_USER')}`,
    },
    template: {
      dir: join(__dirname, 'templates'),  
      adapter: new EjsAdapter(),
      options: {
          strict: false,
      },
  }
  }),  inject: [ConfigService],
}),],
  controllers: [AuthController , UserController],
  providers: [UserService , AtStrategy, RtStrategy ,MailService , LocalStrategy ,ConfirmEmailService , ResetPasswordService],
})
export class UserModule {}
