import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AssessmentService {
  constructor(private prisma: PrismaService) {}

  async create(body:any){
    const cam = await this.prisma.assessmentCampaign.create({ data: { name: body.name, description: body.description, startAt: body.startAt ? new Date(body.startAt) : null, endAt: body.endAt ? new Date(body.endAt) : null } });
    await this.prisma.auditLog.create({ data: { action: 'create', entity: 'AssessmentCampaign', entityId: cam.id } });
    return cam;
  }

  async get(id:string){ return this.prisma.assessmentCampaign.findUnique({ where: { id }, include: { raterAssignments: true, snapshots: true } }); }

  async assign(id:string){
    // naive assign: for campaign, select employees in company and assign manager+self+2 peers
    const campaign = await this.prisma.assessmentCampaign.findUnique({ where: { id } });
    if (!campaign) return { error: 'not found' };
    const employees = await this.prisma.employee.findMany({ take: 10 });
    const assignments:any[] = [];
    for (const e of employees){
      // assign self
      assignments.push({ campaignId: id, employeeId: e.id, raterId: e.id, raterType: 'SELF' });
      // assign manager if exists
      if (e.managerId) assignments.push({ campaignId: id, employeeId: e.id, raterId: e.managerId, raterType: 'MANAGER' });
      // assign 2 peers: naive pick other employees
      const peers = employees.filter(x=>x.id!==e.id).slice(0,2);
      for (const p of peers) assignments.push({ campaignId: id, employeeId: e.id, raterId: p.id, raterType: 'PEER' });
    }
    // bulk create dedup
    for (const a of assignments){
      await this.prisma.raterAssignment.create({ data: a }).catch(()=>{});
    }
    await this.prisma.auditLog.create({ data: { action: 'assign', entity: 'AssessmentCampaign', entityId: id } });
    return { ok: true, created: assignments.length };
  }
}
