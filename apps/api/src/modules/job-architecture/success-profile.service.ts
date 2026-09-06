import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SuccessProfileService {
  constructor(private prisma: PrismaService) {}

  async suggest(jobFamilyId:string, jobLevelId:string, orgUnitId?:string){
    // naive suggestion: pick top competencies from library linked to jobFamily
    const jobFamily = await this.prisma.jobFamily.findUnique({ where: { id: jobFamilyId }, include: { jobLevels: true } });
    const comps = await this.prisma.competency.findMany({ take: 10, include: { currentVersion: true } });
    return { suggestedCompetencies: comps.map(c=>({ competencyId: c.id, title: c.currentVersion?.title })) };
  }

  async create(body:any){
    const profile = await this.prisma.successProfile.create({ data: { jobFamilyId: body.jobFamilyId, jobLevelId: body.jobLevelId, orgUnitId: body.orgUnitId, name: body.name, description: body.description } });
    if (body.competencies && Array.isArray(body.competencies)){
      for(const pc of body.competencies){
        await this.prisma.profileCompetency.create({ data: { profileId: profile.id, competencyId: pc.competencyId, importance: pc.importance || 1, roleCategory: pc.roleCategory || 'Core', targetProficiency: pc.targetProficiency || 2 } });
      }
    }
    await this.prisma.auditLog.create({ data: { action: 'create', entity: 'SuccessProfile', entityId: profile.id } });
    return profile;
  }

  async get(id:string){ return this.prisma.successProfile.findUnique({ where: { id }, include: { profileCompetencies: true, jobFamily: true, jobLevel: true } }); }

  async coverage(id:string, orgUnitId?:string){
    // compute simple coverage: for each profile competency, calculate % employees meeting target
    const profile = await this.get(id);
    if (!profile) return { error: 'not found' };
    const orgId = orgUnitId || profile.orgUnitId;
    const employees = orgId ? await this.prisma.employee.findMany({ where: { orgUnitId: orgId } }) : [];
    const snapshotPromises = employees.map(e => this.prisma.competencyScoreSnapshot.findFirst({ where: { employeeId: e.id }, orderBy: { createdAt: 'desc' } }));
    const snapshots = await Promise.all(snapshotPromises);
    const result = profile.profileCompetencies.map(pc => {
      const met = snapshots.filter(s => { if (!s || !s.scores) return false; const sc = s.scores[pc.competencyId]; if (!sc) return false; return sc.proficiencyOrdinal >= pc.targetProficiency; }).length;
      const total = employees.length || 1;
      return { competencyId: pc.competencyId, coverage: Math.round((met/total)*100) };
    });
    return { totalEmployees: employees.length, breakdown: result };
  }
}
