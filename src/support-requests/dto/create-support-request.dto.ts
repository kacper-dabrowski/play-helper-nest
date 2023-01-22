export class CreateSupportRequestDto {
  title: string;
  description: string;
  department: string;
  content: string;
}

export const fakeCreateSupportRequestDto: CreateSupportRequestDto = {
  title: 'My support request',
  department: 'Technical department',
  description: 'Some description',
  content:
    'Lorem Ipsum is simply dummy text of the printing and typesetting industry. ',
};
