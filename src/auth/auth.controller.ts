import {
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
  Put,
  UnauthorizedException,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/user.entity';
import { DefaultUserService } from '../users/users.service';
import { ValidationPipe } from '../validation/validation.pipe';
import { loginSchema, registrationSchema } from './auth.schema';
import {
  DefaultAuthService,
  UserAuthDto,
  ValdiationResult,
} from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { LocalAuthGuard } from './local-auth.guard';

const validationResultToException = {
  [ValdiationResult.InvalidPassword]: UnauthorizedException,
  [ValdiationResult.UserNotFound]: NotFoundException,
};

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: DefaultUserService,
    private readonly authService: DefaultAuthService,
  ) {}

  @UsePipes(new ValidationPipe(loginSchema))
  @Post()
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  async login(@Body() loginUserDto: LoginUserDto) {
    const { username, password } = loginUserDto;

    const { user, validationResult } = await this.authService.validateUser(
      username,
      password,
    );

    if (!user) {
      throw new validationResultToException[validationResult]();
    }

    return this.authService.login(this.serializeUser(user));
  }

  @UsePipes(new ValidationPipe(registrationSchema))
  @Put()
  @HttpCode(201)
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);

    return this.authService.login(this.serializeUser(user));
  }

  private serializeUser(user: User): UserAuthDto {
    return { username: user.username, id: user.id };
  }
}
