import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { bodyValidationPipe } from '../validation/validation.pipe';
import { CreateSupportRequestDto } from './dto/create-support-request.dto';
import { UpdateSupportRequestDto } from './dto/update-support-request.dto';
import {
  createSupportRequestSchema,
  updateSupportRequestSchema,
} from './support-requests.schema';
import { SupportRequestsService } from './support-requests.service';

@Controller('support-requests')
export class SupportRequestsController {
  constructor(
    private readonly supportRequestsService: SupportRequestsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @UsePipes(bodyValidationPipe(createSupportRequestSchema))
  @Post()
  async create(@Body() createSupportRequestDto: CreateSupportRequestDto) {
    return this.withErrorHandling(() =>
      this.supportRequestsService.create(createSupportRequestDto),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async get(@Query('page') page = '1', @Query('perPage') perPage = '5') {
    return this.withErrorHandling(() =>
      this.supportRequestsService.get(+page, +perPage),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UsePipes(bodyValidationPipe(updateSupportRequestSchema))
  async update(
    @Param('id') id: string,
    @Body()
    updateSupportRequestDto: UpdateSupportRequestDto,
  ) {
    return this.withErrorHandling(() =>
      this.supportRequestsService.update(id, updateSupportRequestDto),
    );
  }

  @UseGuards(JwtAuthGuard)
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
