import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DevPlanService {
  constructor(private prisma: PrismaService) {}

  async create(body:any){
    const plan = await this.prisma.developmentPlan.create({ data: { employeeId: body.employeeId, name: body.name, createdAt: new Date(), items: { create: (body.items || []).map((it:any)=>({ title: it.title, targetDate: it.targetDate ? new Date(it.targetDate) : null, ownerId: it.ownerId })) } } , include: { items: true } as any });
    await this.prisma.auditLog.create({ data: { action: 'create', entity: 'DevelopmentPlan', entityId: plan.id } });
    return plan;
  }

  async get(id:string){ return this.prisma.developmentPlan.findUnique({ where: { id }, include: { items: true } }); }
}
