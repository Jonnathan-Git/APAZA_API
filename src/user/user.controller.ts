import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { Response } from 'src/domain/response';
import { UpdateUserDto } from './dtos/update-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';

@Controller('user')
export class UserController {

  constructor(private readonly userService:UserService) {}

  @Post()
  async create(@Body(new ValidationPipe()) user: CreateUserDto): Promise<Response> {
    return this.userService.create(user);
  }

  @Post('login')
  async login(@Body(new ValidationPipe()) user: LoginUserDto): Promise<Response> {
    return this.userService.login(user);
  }

  @Put()
  async update(@Body(new ValidationPipe()) user: UpdateUserDto): Promise<Response> {
    return this.userService.update(user);
  }

  @Delete(':id')
  async delete(@Param('id') id:string): Promise<Response> {
    return this.userService.delete(id);
  }

  @Get()
  async findAll(): Promise<Response> {
    return this.userService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id:string): Promise<Response> {
    return this.userService.findById(id);
  }
}
