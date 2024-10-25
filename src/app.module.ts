import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
 import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [  ConfigModule.forRoot({ isGlobal: true }) ,  TypeOrmModule.forRoot({ ...typeOrmConfig, entities: [User] }),
  UserModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
