import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import session, { SessionOptions } from 'express-session';
import passport from 'passport';
import { AppModule } from './modules/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { config } from 'aws-sdk';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const sessionConfig = configService.get<SessionOptions>('session');

  app.use(session(sessionConfig));
  app.use(passport.initialize());
  app.use(passport.session());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    }),
  );
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Realestate app')
    .setDescription('rest api documentation for realestate app')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  config.update({
    accessKeyId: configService.get('S3_ACCESS_KEY_ID'),
    secretAccessKey: configService.get('S3_SECRET_ACCESS_KEY'),
    region: configService.get('S3_REGION'),
  });

  const port = configService.get('SERVER_PORT');
  await app.listen(port);
}
bootstrap();
