import { Body, Controller, Ip, Post, Req, Request } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  public async create(
    @Body() createUserDto: CreateUserDto,
    @Req() request: Request,
    @Ip() ip: string,
  ): Promise<any> {
    const userAgent = request.headers['user-agent'];

    return this.usersService.create(createUserDto, userAgent, ip);
  }
}
