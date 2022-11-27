import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findOne(id: string) {
    const mediaItem = await this.mediaItemRepository.findById(id);
    if (!mediaItem) {
      throw new NotFoundException(`media item with id ${id} not found`);
    }
    return mediaItem;
  }

  update(id: string, updateMediaItemDto: UpdateMediaItemDto) {
    this.mediaItemRepository.update(id, updateMediaItemDto);
  }

  async remove(id: string) {
    const mediaItem = await this.findOne(id);
    const Key = mediaItem.url.split('/')[3];

    await this.s3.deleteObject({
      Bucket: this.bucketName,
      Key,
    });
    // this.mediaItemRepository.delete(id);
  }
}
