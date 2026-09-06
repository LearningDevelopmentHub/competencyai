import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AiService } from '../competency/ai.service';

@Injectable()
export class JobDescriptionService {
  constructor(private prisma: PrismaService, private ai: AiService) {}

  async generate(profileId:string){
    const profile = await this.prisma.successProfile.findUnique({ where: { id: profileId }, include: { profileCompetencies: true, jobLevel: true, jobFamily: true } });
    if (!profile) return { error: 'profile not found' };
    const prompt = `Generate job description for ${profile.name?.en || 'profile'} with competencies: ${profile.profileCompetencies.map(p=>p.competencyId).join(',')}`;
    const aiResp:any = await this.ai.decodeKsao(prompt); // reuse mock to produce content placeholder
    const versionNumber = (await this.prisma.jobDescription.count({ where: { profileId } })) + 1;
    const jd = await this.prisma.jobDescription.create({ data: { profileId, versionNumber, title: { en: `JD ${profile.name?.en||profileId}`, vi: `JD ${profile.name?.vi||profileId}` }, content: { en: JSON.stringify(aiResp), vi: JSON.stringify(aiResp) }, generatedBy: null } });
    await this.prisma.auditLog.create({ data: { action: 'generate', entity: 'JobDescription', entityId: jd.id } });
    return jd;
  }

  async listByProfile(profileId:string){ return this.prisma.jobDescription.findMany({ where: { profileId }, orderBy: { versionNumber: 'desc' } }); }
}
