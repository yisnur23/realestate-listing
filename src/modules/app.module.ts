import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configSchema, database, google, session } from '../config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { DataSourceOptions } from 'typeorm';
import { TagModule } from './tag/tag.module';
import { AbilityModule } from './ability/ability.module';
import { APP_GUARD } from '@nestjs/core';
import { AbilitiesGuard } from './ability/ability.guard';
import { AuthenticationGuard } from './auth/auth.guard';
import { AddressModule } from './address/address.module';
import { AddressRoutes } from './address/address.routes';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [database, google, session],
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
    AuthModule,
    ProfileModule,
    TagModule,
    AbilityModule,
    AddressModule,
    RouterModule.register(AddressRoutes),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthenticationGuard,
    // },
    // {
    //   provide: APP_GUARD,
    //   useClass: AbilitiesGuard,
    // },
  ],
})
export class AppModule {}
