import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { JobFamilyService } from './job-family.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('job-families')
export class JobFamilyController {
  constructor(private svc: JobFamilyService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async list() { return this.svc.list(); }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() body: { code: string; name: any; careerStream?: string }) { return this.svc.create(body); }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async get(@Param('id') id: string) { return this.svc.get(id); }
}
