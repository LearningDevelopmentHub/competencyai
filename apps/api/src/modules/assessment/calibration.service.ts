import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CalibrationService {
  constructor(private prisma: PrismaService) {}

  async create(body:any){
    const session = await this.prisma.calibrationSession.create({ data: { name: body.name, description: body.description, sessionDate: body.sessionDate ? new Date(body.sessionDate) : new Date() } });
    await this.prisma.auditLog.create({ data: { action: 'create', entity: 'CalibrationSession', entityId: session.id } });
    return session;
  }

  async addRating(sessionId:string, body:any){
    // body: { employeeId, boxX, boxY, rating }
    const rating = await this.prisma.calibrationRating.create({ data: { sessionId, employeeId: body.employeeId, boxX: body.boxX, boxY: body.boxY, rating: body.rating } });
    await this.prisma.auditLog.create({ data: { action: 'rate', entity: 'CalibrationRating', entityId: rating.id } });
    return rating;
  }

  async get(sessionId:string){ return this.prisma.calibrationSession.findUnique({ where: { id: sessionId }, include: { ratings: true } }); }
}
