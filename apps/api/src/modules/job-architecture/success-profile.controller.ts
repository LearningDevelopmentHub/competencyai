import { Controller, Post, Body, Get, Param, UseGuards, Query } from '@nestjs/common';
import { SuccessProfileService } from './success-profile.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('success-profiles')
export class SuccessProfileController {
  constructor(private svc: SuccessProfileService) {}

  @UseGuards(JwtAuthGuard)
  @Post('suggest')
  async suggest(@Body() body: { jobFamilyId: string; jobLevelId: string; orgUnitId?: string }){
    return this.svc.suggest(body.jobFamilyId, body.jobLevelId, body.orgUnitId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() body: any){ return this.svc.create(body); }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async get(@Param('id') id:string){ return this.svc.get(id); }

  @UseGuards(JwtAuthGuard)
  @Get(':id/coverage')
  async coverage(@Param('id') id:string, @Query('orgUnitId') orgUnitId?: string){ return this.svc.coverage(id, orgUnitId); }
}
