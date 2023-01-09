import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

export interface UserService {
  findByUsername(username: string): Promise<User>;
  create(createUserDto: CreateUserDto): Promise<User>;
}
