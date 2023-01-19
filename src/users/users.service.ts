import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './service';
import { User } from './user.entity';
import { hash as bcryptHash } from 'bcrypt';

@Injectable()
export class DefaultUserService implements UserService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { password, username, ...restOfUser } = createUserDto;

    const user = await this.findByUsername(username);

    if (user) {
      throw new ConflictException('User with given username already exists');
    }

    const hashedPassword = await bcryptHash(password, 8);

    const userToCreate = this.repository.create({
      ...restOfUser,
      password: hashedPassword,
      username,
    });

    await this.repository.save(userToCreate);

    return userToCreate;
  }

  findByUsername(username: string) {
    return this.repository.findOneBy({ username });
  }
}
