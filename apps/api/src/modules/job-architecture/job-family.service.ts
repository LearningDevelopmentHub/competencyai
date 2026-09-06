import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JobFamilyService {
  constructor(private prisma: PrismaService) {}

  async list() { return this.prisma.jobFamily.findMany({ include: { jobLevels: true } }); }

  async create(data:{ code:string; name:any; careerStream?:string }){
    return this.prisma.jobFamily.create({ data: { code: data.code, name: data.name, careerStream: data.careerStream } });
  }

  async get(id:string){ return this.prisma.jobFamily.findUnique({ where: { id }, include: { jobLevels: true } }); }
}
