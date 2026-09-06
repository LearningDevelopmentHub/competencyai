import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LearningService {
  constructor(private prisma: PrismaService) {}

  async listResources(q?: string){
    const where:any = {};
    if (q) where.AND = [{ title: { path: ['en'], equals: q } }]; // placeholder simple filter
    const res = await this.prisma.learningResource.findMany({ take: 50 });
    return res;
  }

  async recommend(employeeId?:string, profileId?:string){
    // mock recommendations using AiService pattern: pick top 5 resources
    const resources = await this.prisma.learningResource.findMany({ take: 5 });
    return { recommendations: resources.map(r=>({ id: r.id, title: r.title })) };
  }
}
