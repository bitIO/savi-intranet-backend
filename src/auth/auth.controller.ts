import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@ApiTags('auth')
@Controller('auth')
class AuthController {
  constructor(private authService: AuthService) {}

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
}

export { AuthController };
