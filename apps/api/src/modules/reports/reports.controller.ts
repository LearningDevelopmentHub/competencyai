import { Controller, Post, Body, UseGuards, Get, Param, Query, Header, Res } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Response } from 'express';

@Controller('reports')
export class ReportsController {
  constructor(private svc: ReportsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async list() {
    return this.svc.listAvailable();
  }

  @UseGuards(JwtAuthGuard)
  @Post('run')
  async run(@Body() body: { reportType: string; params?: any }) {
    return this.svc.runReport(body.reportType, body.params || {});
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/results')
  async results(@Param('id') id: string, @Query('page') page = '1') {
    return this.svc.getResults(id, parseInt(page, 10));
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/export')
  async export(@Param('id') id: string, @Query('format') format = 'csv', @Res() res: Response) {
    const stream = await this.svc.export(id, format as 'csv' | 'pdf');
    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="report-${id}.csv"`);
      return res.send(stream);
    }
    // PDF stub: return 202 Accepted with message
    res.status(202).json({ status: 'queued', message: 'PDF export is stubbed in this environment' });
  }
}
