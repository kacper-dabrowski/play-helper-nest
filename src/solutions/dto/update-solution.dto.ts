import { PartialType } from '@nestjs/mapped-types';
import { CreateSolutionDto } from './create-solution.dto';

export class UpdateSolutionDto extends PartialType(CreateSolutionDto) {}

export const fakeUpdateSolutionDto: UpdateSolutionDto = {
  title: 'new title',
  content: 'new content',
};
