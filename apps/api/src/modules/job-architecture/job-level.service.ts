import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JobLevelService {
  constructor(private prisma: PrismaService) {}

  async list(){ return this.prisma.jobLevel.findMany({ include: { jobFamily: true } }); }

  async create(body:any){
    // derive isManagerial from levelCode mapping
    const managerial = ['MLL','BUL','SE'].includes(body.levelCode);
    return this.prisma.jobLevel.create({ data: { jobFamilyId: body.jobFamilyId, levelCode: body.levelCode, name: body.name, stageOfContribution: body.stageOfContribution || 1, isManagerial: managerial, rank: body.rank || 0 } });
  }

  async get(id:string){ return this.prisma.jobLevel.findUnique({ where: { id }, include: { jobFamily: true } }); }
}
