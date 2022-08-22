import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserHolidaysModule } from '../user-holidays/user-holidays.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAccessStrategy, JwtRefreshStrategy } from './strategy';

@Module({
  controllers: [AuthController],
  imports: [JwtModule.register({}), UserHolidaysModule],
  providers: [AuthService, JwtAccessStrategy, JwtRefreshStrategy],
})
class AuthModule {}

export { AuthModule };
