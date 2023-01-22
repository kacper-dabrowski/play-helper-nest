import { PartialType } from '@nestjs/mapped-types';
import { CreateSupportRequestDto } from './create-support-request.dto';

export class UpdateSupportRequestDto extends PartialType(
  CreateSupportRequestDto,
) {}

export const fakeUpdateSupportRequestDto: UpdateSupportRequestDto = {
  title: 'new title',
  content: 'new content',
};
