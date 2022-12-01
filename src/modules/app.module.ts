import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AwsSdkModule } from 'nest-aws-sdk';
import { S3 } from 'aws-sdk';
import {
  aws,
  AWSConfig,
  configSchema,
  database,
  google,
  session,
  redis,
  sentry,
} from '../config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { DataSourceOptions } from 'typeorm';
import { TagModule } from './tag/tag.module';
import { AbilityModule } from './ability/ability.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AbilitiesGuard } from './ability/ability.guard';
import { AuthenticationGuard } from './auth/auth.guard';
import { AddressModule } from './address/address.module';
import { AddressRoutes } from './address/address.routes';
import { ListingModule } from './listing/listing.module';
import { MediaItemModule } from './media-item/media-item.module';
import { SentryInterceptor } from '../common/interceptors/sentry.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [database, google, session, aws, redis, sentry],
      validationSchema: configSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
      cache: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...configService.get<DataSourceOptions>('database'),
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    AwsSdkModule.forRootAsync({
      defaultServiceOptions: {
        useFactory: (configService: ConfigService) => {
          const awsConfig = configService.get<AWSConfig>('aws');

          return {
            region: awsConfig.region,
            credentials: {
              accessKeyId: awsConfig.accessKeyId,
              secretAccessKey: awsConfig.secretAccessKey,
            },
          };
        },
        imports: [ConfigModule],
        inject: [ConfigService],
      },
      services: [
        {
          service: S3,
          serviceOptions: {
            signatureVersion: 'v4',
          },
        },
      ],
    }),
    AuthModule,
    ProfileModule,
    TagModule,
    AbilityModule,
    AddressModule,
    RouterModule.register(AddressRoutes),
    ListingModule,
    MediaItemModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AbilitiesGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: SentryInterceptor,
    },
  ],
})
export class AppModule {}
