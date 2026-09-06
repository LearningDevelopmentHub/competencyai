import { Controller, Get, Post, Body, Param, Patch, UseGuards, Query } from '@nestjs/common';
import { CompetencyService } from './competency.service';
import { CreateCompetencyDto } from './dto/create-competency.dto';
import { CreateVersionDto } from './dto/create-version.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@Controller('competencies')
export class CompetencyController {
  constructor(private readonly svc: CompetencyService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async list(@Query('framework') framework?: string) {
    return this.svc.list(framework as any);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin','CompetencySpecialist','HRBP')
  @Post()
  async create(@Body() dto: CreateCompetencyDto) {
    return this.svc.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async get(@Param('id') id: string) {
    return this.svc.get(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin','CompetencySpecialist','HRBP')
  @Post(':id/versions')
  async createVersion(@Param('id') id: string, @Body() dto: CreateVersionDto) {
    return this.svc.createVersion(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin','CompetencySpecialist','HRBP')
  @Patch(':id/versions/:vid/publish')
  async publish(@Param('id') id: string, @Param('vid') vid: string) {
    return this.svc.publishVersion(id, vid);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin','CompetencySpecialist','HRBP')
  @Patch(':id/versions/:vid/archive')
  async archive(@Param('id') id: string, @Param('vid') vid: string) {
    return this.svc.archiveVersion(id, vid);
  }
}
