import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api')

  const options = new DocumentBuilder()
    .setTitle('APIs pour l\'application de Réservation de Stades ResveMatch')
    .setDescription('Ces APIs permettent la réservation de stades et de matchs en ligne.')
    .setVersion('1.0')
    .addServer('http://localhost:3000/', 'Environnement local')
    .addServer('http://57.128.159.235/', 'Environnement Prod')
     .build();

  const document = SwaggerModule.createDocument(app, options ,
    {
      include: [],
      deepScanRoutes: true,
    }
   );
  SwaggerModule.setup('api-docs', app, document);

  app.useGlobalPipes(new ValidationPipe(
    {
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }
  ));
  app.enableCors();

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
