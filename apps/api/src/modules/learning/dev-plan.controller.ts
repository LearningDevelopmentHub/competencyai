import { Controller, Post, Body, UseGuards, Get, Param } from '@nestjs/common';
import { DevPlanService } from './dev-plan.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('development-plans')
export class DevPlanController {
  constructor(private svc: DevPlanService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() body:any){ return this.svc.create(body); }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async get(@Param('id') id:string){ return this.svc.get(id); }
}
