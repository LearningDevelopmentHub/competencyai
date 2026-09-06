import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { JobLevelService } from './job-level.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('job-levels')
export class JobLevelController {
  constructor(private svc: JobLevelService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async list(){ return this.svc.list(); }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() body: any){ return this.svc.create(body); }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async get(@Param('id') id:string){ return this.svc.get(id); }
}
