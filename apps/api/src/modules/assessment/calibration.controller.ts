import { Controller, Post, Body, UseGuards, Get, Param } from '@nestjs/common';
import { CalibrationService } from './calibration.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('calibration-sessions')
export class CalibrationController {
  constructor(private svc: CalibrationService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() body:any){ return this.svc.create(body); }

  @UseGuards(JwtAuthGuard)
  @Post(':id/ratings')
  async addRating(@Param('id') id:string, @Body() body:any){ return this.svc.addRating(id, body); }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async get(@Param('id') id:string){ return this.svc.get(id); }
}
