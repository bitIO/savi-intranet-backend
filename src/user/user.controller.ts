import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { Role, User } from '@prisma/client';
import { GetUser, Roles } from '../auth/decorator';
import { JwtGuard, RolesGuard } from '../auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
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

  @Patch('/:id/roles')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  switchRoles(@GetUser('id') userId: number, @Body() dto: EditUserDto) {
    return this.userService.switchRole(userId, dto);
  }
}
