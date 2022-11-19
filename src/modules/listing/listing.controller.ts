import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ListingService } from './listing.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { CheckAbilities } from '../ability/ability.decorator';
import { ListingAbility } from './listing.abilities';
import { Public } from '../auth/auth.decorator';

@Controller('listings')
export class ListingController {
  constructor(private readonly listingService: ListingService) {}

  @Post()
  @CheckAbilities(ListingAbility.Create)
  create(@Req() req, @Body() createListingDto: CreateListingDto) {
    const user = req.user;
    return this.listingService.create(
      createListingDto,
      '2e520ad7-274b-4ff8-a498-198329a023ce',
    );
  }

  @Get()
  @Public()
  findAll(
    @Query('take') take: number,
    @Query('skip') skip: number,
    @Query() query,
  ) {
    return this.listingService.findAll(take, skip, query);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.listingService.findOne(id);
  }

  @Patch(':id')
  @CheckAbilities(ListingAbility.Update)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateListingDto: UpdateListingDto,
  ) {
    return this.listingService.update(id, updateListingDto);
  }

  @Delete(':id')
  @CheckAbilities(ListingAbility.Delete)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.listingService.remove(id);
  }
}
