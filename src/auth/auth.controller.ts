import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { AuthService } from './auth.service';
import { GetUser } from './decorator';
import { AuthDto } from './dto';
import { JwtAccessGuard, JwtRefreshGuard } from './guard';

@ApiTags('auth')
@Controller('auth')
class AuthController {
  constructor(private authService: AuthService) {}

  @ApiBody({
    type: AuthDto,
  })
  @ApiResponse({
    description: 'User has been created',
    status: 201,
  })
  @Post('signup')
  signUp(@Body() dto: AuthDto) {
    return this.authService.signUp(dto);
  }

  @ApiBody({
    type: AuthDto,
  })
  @ApiResponse({
    description: 'Login credentials are valid',
    status: 202,
  })
  @HttpCode(HttpStatus.ACCEPTED)
  @Post('signin')
  signIn(@Body() dto: AuthDto) {
    return this.authService.signIn(dto);
  }

  @UseGuards(JwtAccessGuard)
  @Post('logout')
  logout(@GetUser() user: User) {
    return this.authService.logout(user);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  refreshTokens(@GetUser() user: User) {
    return this.authService.refreshTokens(user);
  }
}

export { AuthController };
