export class LoginUserDto {
  username: string;
  password: string;
}

export const fakeLoginUserDto: LoginUserDto = {
  username: 'jdoe',
  password: 's0me-p4ssword',
};
