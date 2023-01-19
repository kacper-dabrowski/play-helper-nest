import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { SupportRequestsService } from './support-requests.service';
import { CreateSupportRequestDto } from './dto/create-support-request.dto';
import { UpdateSupportRequestDto } from './dto/update-support-request.dto';

@Controller('support-requests')
export class SupportRequestsController {
  constructor(
    private readonly supportRequestsService: SupportRequestsService,
  ) {}

  @Post()
  create(@Body() createSupportRequestDto: CreateSupportRequestDto) {
    return this.supportRequestsService.create(createSupportRequestDto);
  }

  @Get()
  findAll(@Query('page') page: number, @Query('perPage') perPage: number) {
    return this.supportRequestsService.get(+page, +perPage);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSupportRequestDto: UpdateSupportRequestDto,
  ) {
    return this.supportRequestsService.update(id, updateSupportRequestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.supportRequestsService.remove(id);
  }
}
