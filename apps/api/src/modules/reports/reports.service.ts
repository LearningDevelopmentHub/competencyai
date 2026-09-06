import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import csvStringify from 'csv-stringify/lib/sync';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async listAvailable() {
    // static catalog of reports
    return [
      { id: 'coverage_by_org', title: 'Competency Coverage by OrgUnit', description: 'Shows coverage of target proficiencies per org unit' },
      { id: 'campaign_summary', title: 'Campaign Results', description: 'Rater distributions and averages for a campaign' },
      { id: 'learning_completion', title: 'Learning Completion Rates', description: 'Completion % per learning resource or org unit' },
    ];
  }

  async runReport(reportType: string, params: any) {
    // store run metadata
    const run = await this.prisma.reportRun.create({ data: { reportType, params, status: 'READY' } });
    await this.prisma.auditLog.create({ data: { action: 'run', entity: 'ReportRun', entityId: run.id } });
    // generate simple results based on seed/demo data
    let results: any[] = [];
    if (reportType === 'coverage_by_org') {
      const orgs = await this.prisma.orgUnit.findMany({ take: 10 });
      results = orgs.map(o => ({ orgUnitId: o.id, orgName: o.name, coverage: Math.floor(Math.random()*100) }));
    } else if (reportType === 'campaign_summary') {
      const campaigns = await this.prisma.assessmentCampaign.findMany({ take: 5 });
      results = campaigns.map(c=>({ campaignId: c.id, name: c.name, avgScore: +(Math.random()*4).toFixed(2) }));
    } else if (reportType === 'learning_completion') {
      const resources = await this.prisma.learningResource.findMany({ take: 10 });
      results = resources.map(r=>({ resourceId: r.id, title: r.title, completionRate: Math.floor(Math.random()*100) }));
    }
    // persist results json
    for (const r of results) {
      await this.prisma.reportResult.create({ data: { runId: run.id, result: r } });
    }
    return { runId: run.id, count: results.length };
  }

  async getResults(runId: string, page = 1) {
    const pageSize = 50;
    const rows = await this.prisma.reportResult.findMany({ where: { runId }, skip: (page-1)*pageSize, take: pageSize });
    return { runId, page, rows: rows.map(r=>r.result) };
  }

  async export(runId: string, format: 'csv'|'pdf'){
    const rows = await this.prisma.reportResult.findMany({ where: { runId } });
    const data = rows.map(r=>r.result);
    if (format === 'csv'){
      // flatten simple objects for CSV
      const headers = Array.from(new Set(data.flatMap((d:any)=>Object.keys(d))));
      const records = data.map((d:any)=>headers.map((h:any)=>d[h] ?? ''));
      const csv = csvStringify(records, { header: true, columns: headers });
      return csv;
    }
    return null;
  }
}
