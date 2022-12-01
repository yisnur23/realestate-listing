import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import session, { SessionOptions } from 'express-session';
import passport from 'passport';
import { AppModule } from './modules/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { config } from 'aws-sdk';
import * as Sentry from '@sentry/node';
import { createClient } from 'redis';
import connectRedis from 'connect-redis';

import helmet from 'helmet';

async function bootstrap() {
  const logger = new Logger();

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const sessionConfig = configService.get<SessionOptions>('session');
  const sentryDsn = configService.get('sentry.dsn');
  const redisHost: string = configService.get('redis.host');
  const redisPort: number = configService.get('redis.port');

  const redisUrl = `redis://${redisHost}:${redisPort}`;
  const redisClient = createClient({
    url: redisUrl,
  });
  await redisClient.connect();
  const RedisStore = connectRedis(session);

  redisClient.on('error', (err) =>
    Logger.error('Could not establish a connection with redis. ' + err),
  );
  redisClient.on('connect', () =>
    Logger.verbose('Connected to redis successfully'),
  );

  app.use(helmet());
  app.use(
    session({
      ...sessionConfig,
      // store: new RedisStore({ client: redisClient }),
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    }),
  );
  Sentry.init({
    dsn: sentryDsn,
  });
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
