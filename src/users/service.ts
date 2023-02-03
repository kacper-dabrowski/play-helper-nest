import { CreateUserDto } from './dto/create-user.dto';
import { UserModel } from './user.entity';

export interface UserService {
  findByUsername({ username }: { username: string }): Promise<UserModel>;
  create(createUserDto: CreateUserDto): Promise<UserModel>;
}
