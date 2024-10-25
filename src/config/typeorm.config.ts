import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import 'dotenv/config'
export const typeOrmConfig: TypeOrmModuleOptions = {
    type: process.env.DATABASE_TYPE as 'mysql',
    host: process.env.DATABASE_HOST,
    port: +process.env.DATABASE_PORT,  
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    synchronize: true,
    migrationsRun: true,
};
