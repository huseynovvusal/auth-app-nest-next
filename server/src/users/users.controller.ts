import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Ip,
  Post,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { Request, Response } from 'express';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { RequestUser } from 'src/auth/types/requestUser.type';
import { User } from './entities/user.entity';

/*
 * Users Controller
 */
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // /*
  //  * Create a new user
  //  */
  // @Post('create')
  // // Restrict access to this route to logged-in users
  // @Auth(AuthType.NoCookie)
  // @UseInterceptors(ClassSerializerInterceptor)
  // public async create(
  //   @Body() createUserDto: CreateUserDto,
  //   @Req() request: Request,
  //   @Res({ passthrough: true }) response: Response,
  //   @Ip() ip: string,
  // ): Promise<User> {
  //   const userAgent = request.headers['user-agent'];

  //   return this.usersService.create(createUserDto, userAgent, ip, response);
  // }

  /*
   * Get User Info (Check User)
   */
  @Get('info')
  public async getUserInfo(@Req() request: RequestUser): Promise<any> {
    return { user: request.user };
  }
}
