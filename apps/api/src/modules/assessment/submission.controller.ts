import { Controller, Post, Body, UseGuards, Get, Param } from '@nestjs/common';
import { SubmissionService } from './submission.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('assignments')
export class SubmissionController {
  constructor(private svc: SubmissionService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':id/submissions')
  async submit(@Param('id') id:string, @Body() body: any){ return this.svc.submit(id, body); }

  @UseGuards(JwtAuthGuard)
  @Get(':id/submissions')
  async list(@Param('id') id:string){ return this.svc.list(id); }
}
