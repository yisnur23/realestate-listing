import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import cuid from 'cuid';
import { CreateMediaItemDto } from './dto/create-media-item.dto';
import { UpdateMediaItemDto } from './dto/update-media-item.dto';
import { MediaItemRepository } from './media-item.repository';
import { InjectAwsService } from 'nest-aws-sdk';
import { S3 } from 'aws-sdk';

@Injectable()
export class MediaItemService {
  constructor(
    private mediaItemRepository: MediaItemRepository,
    private configService: ConfigService,
    @InjectAwsService(S3) private readonly s3: S3,
  ) {}
  private bucketName = this.configService.get('aws.bucketName');
  async create(createMediaItemDto: CreateMediaItemDto[]) {
    const mediaItems = this.mediaItemRepository.create(createMediaItemDto);
    await this.mediaItemRepository.insert(mediaItems);
    return mediaItems;
  }

  async generateSignedUrl() {
    const imageName = cuid();
    const url = await this.s3.getSignedUrlPromise('putObject', {
      Bucket: this.bucketName,
      Key: imageName,
      Expires: 120,
    });
    return { url };
  }

  update(id: string, updateMediaItemDto: UpdateMediaItemDto) {
    this.mediaItemRepository.update(id, updateMediaItemDto);
  }

  remove(id: string) {
    return `This action removes a #${id} mediaItem`;
  }
}
