import { Controller, Post, Body, UseGuards, Get, Param } from '@nestjs/common';
import { AssessmentService } from './assessment.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('campaigns')
export class AssessmentController {
  constructor(private svc: AssessmentService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() body: any){ return this.svc.create(body); }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async get(@Param('id') id: string){ return this.svc.get(id); }

  @UseGuards(JwtAuthGuard)
  @Post(':id/assign')
  async assign(@Param('id') id: string){ return this.svc.assign(id); }
}
