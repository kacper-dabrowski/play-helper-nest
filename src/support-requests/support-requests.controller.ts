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
  async create(@Body() createSupportRequestDto: CreateSupportRequestDto) {
    return this.withErrorHandling(() =>
      this.supportRequestsService.create(createSupportRequestDto),
    );
  }

  @Get()
  async get(@Query('page') page: string, @Query('perPage') perPage: string) {
    return this.withErrorHandling(() =>
      this.supportRequestsService.get(+page, +perPage),
    );
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSupportRequestDto: UpdateSupportRequestDto,
  ) {
    return this.withErrorHandling(() =>
      this.supportRequestsService.update(id, updateSupportRequestDto),
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.checkIfOperationSuccessful(() =>
      this.supportRequestsService.remove(id),
    );
  }

  private async withErrorHandling<T>(handler: () => Promise<T>) {
    try {
      const response = await handler();

      return { ...response, success: true };
    } catch (error) {
      return { success: false, error };
    }
  }

  private async checkIfOperationSuccessful<T>(handler: () => Promise<T>) {
    try {
      await handler();

      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }
}
