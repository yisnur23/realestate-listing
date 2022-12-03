import { Module } from '@nestjs/common';
import { AwsSdkModule } from 'nest-aws-sdk';
import { S3 } from 'aws-sdk';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MediaItemService } from './media-item.service';
import { MediaItemController } from './media-item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaItem } from './entities/media-item.entity';
import { MediaItemRepository } from './media-item.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([MediaItem]),
    AwsSdkModule.forRootAsync({
      defaultServiceOptions: {
        useFactory: (configService: ConfigService) => {
          const awsConfig = configService.get('aws');

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
  ],
  controllers: [MediaItemController],
  providers: [MediaItemService, MediaItemRepository],
  exports: [MediaItemService],
})
export class MediaItemModule {}
