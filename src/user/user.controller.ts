import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role, User } from '@prisma/client';
import { GetUser, Roles } from '../auth/decorator';
import { JwtAccessGuard, RolesGuard } from '../auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

@ApiBearerAuth()
@ApiTags('user')
@UseGuards(JwtAccessGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  @Patch()
  editUser(@GetUser('id') userId: number, @Body() dto: EditUserDto) {
    return this.userService.editUser(userId, dto);
  }

  @Patch('/:userId/roles')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  switchRoles(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() dto: EditUserDto,
  ) {
    return this.userService.switchRole(userId, dto);
  }
}
