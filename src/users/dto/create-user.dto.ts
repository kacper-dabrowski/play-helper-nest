export class CreateUserDto {
  username: string;
  password: string;
  fullName: string;
  startingPage: string;
}

export const fakeCreateUserDto: CreateUserDto = {
  username: 'jdoe',
  password: 'p4ssword!23',
  fullName: 'John Doe',
  startingPage: '/basic',
};
