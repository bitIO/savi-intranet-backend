import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAccessGuard } from '../auth/guard';
import { UserHolidaysService } from './user-holidays.service';

@ApiBearerAuth()
@ApiTags('user-holidays')
@UseGuards(JwtAccessGuard)
@Controller('users-holidays')
export class UserHolidaysController {
  constructor(private userService: UserHolidaysService) {}
}
