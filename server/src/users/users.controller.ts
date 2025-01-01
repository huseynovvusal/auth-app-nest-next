import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Ip,
  Param,
  ParseIntPipe,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { Request, Response } from 'express';
import { AccessTokenGuard } from 'src/auth/guards/access-token/access-token.guard';

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

  /*
   * Get User Info //!(Route Check)
   */
  @UseGuards(AccessTokenGuard)
  @Get(':id')
  public async getUserInfo(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<any> {
    // !
    console.log('User ID:', id);
  }
}
