import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { LearningService } from './learning.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('learning')
export class LearningController {
  constructor(private svc: LearningService) {}

  @UseGuards(JwtAuthGuard)
  @Get('resources')
  async list(@Query('q') q?: string) {
    return this.svc.listResources(q);
  }

  @UseGuards(JwtAuthGuard)
  @Get('recommendations')
  async recommendations(@Query('employeeId') employeeId?: string, @Query('profileId') profileId?: string) {
    return this.svc.recommend(employeeId, profileId);
  }
}
