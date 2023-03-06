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
import { GetUser } from '../auth/getUser.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserModel } from '../users/user.entity';
import { bodyValidationPipe } from '../validation/validation.pipe';
import { CreateSolutionDto } from './dto/create-solution.dto';
import { UpdateSolutionDto } from './dto/update-solution.dto';
import { createSolutionSchema, updateSolutionSchema } from './solutions.schema';
import { SolutionsService } from './solutions.service';

@Controller('solutions')
export class SolutionsController {
  constructor(private readonly solutionsService: SolutionsService) {}

  @UseGuards(JwtAuthGuard)
  @UsePipes(bodyValidationPipe(createSolutionSchema))
  @Post()
  async create(
    @Body() createSolutionDto: CreateSolutionDto,
    @GetUser() user: UserModel,
  ) {
    return this.withErrorHandling(() =>
      this.solutionsService.create(
        { ...createSolutionDto, isPublic: createSolutionDto.isPublic ?? false },
        user.id,
      ),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async get(
    @Query('page') page = '1',
    @Query('perPage') perPage = '5',
    @GetUser() user: UserModel,
  ) {
    return this.withErrorHandling(() =>
      this.solutionsService.getForUser({
        page: +page,
        perPage: +perPage,
        authorId: user.id,
      }),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UsePipes(bodyValidationPipe(updateSolutionSchema))
  async update(
    @Param('id') id: string,
    @Body()
    updateSolutionDto: UpdateSolutionDto,
  ) {
    return this.withErrorHandling(() =>
      this.solutionsService.update(id, updateSolutionDto),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.checkIfOperationSuccessful(() =>
      this.solutionsService.remove(id),
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
