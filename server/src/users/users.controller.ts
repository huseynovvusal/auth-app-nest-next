import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Ip,
  Post,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { Request, Response } from 'express';

/*
 * Users Controller
 */
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /*
   * Create a new user
   */
  @Post('create')
  @UseInterceptors(ClassSerializerInterceptor)
  public async create(
    @Body() createUserDto: CreateUserDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
    @Ip() ip: string,
  ): Promise<any> {
    const userAgent = request.headers['user-agent'];

    return this.usersService.create(createUserDto, userAgent, ip, response);
  }
}
