export class CreateSolutionDto {
  title: string;
  description: string;
  content: string;
  isPublic: boolean;
}

export const fakeCreateSolutionDto: CreateSolutionDto = {
  title: 'My support request',
  description: 'Some description',
  content:
    'Lorem Ipsum is simply dummy text of the printing and typesetting industry. ',
  isPublic: false,
};
