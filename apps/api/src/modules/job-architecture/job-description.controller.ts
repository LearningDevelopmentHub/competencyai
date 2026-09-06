import { Controller, Post, Body, UseGuards, Get, Param } from '@nestjs/common';
import { JobDescriptionService } from './job-description.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('job-descriptions')
export class JobDescriptionController {
  constructor(private svc: JobDescriptionService) {}

  @UseGuards(JwtAuthGuard)
  @Post('generate')
  async generate(@Body() body: { profileId: string }){ return this.svc.generate(body.profileId); }

  @UseGuards(JwtAuthGuard)
  @Get('profile/:profileId')
  async listByProfile(@Param('profileId') profileId:string){ return this.svc.listByProfile(profileId); }
}
