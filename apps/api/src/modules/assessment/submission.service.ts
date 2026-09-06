import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SubmissionService {
  constructor(private prisma: PrismaService) {}

  async submit(assignmentId:string, body:any){
    // body: { submittedById, responses: [{ competencyId, score, evidence }] }
    const assignment = await this.prisma.raterAssignment.findUnique({ where: { id: assignmentId } });
    if (!assignment) return { error: 'assignment not found' };
    const sub = await this.prisma.assessmentSubmission.create({ data: { assignmentId, submittedById: body.submittedById, status: 'SUBMITTED', submittedAt: new Date() } });
    for (const r of body.responses){
      const rr = await this.prisma.raterResponse.create({ data: { submissionId: sub.id, competencyId: r.competencyId, score: r.score, comment: r.comment || null } });
      if (r.evidence){
        const ev = await this.prisma.evidence.create({ data: { responseId: rr.id, text: r.evidence } });
      }
    }
    await this.prisma.auditLog.create({ data: { action: 'submit', entity: 'AssessmentSubmission', entityId: sub.id } });
    return { ok: true, submissionId: sub.id };
  }

  async list(assignmentId:string){ return this.prisma.assessmentSubmission.findMany({ where: { assignmentId }, include: { responses: true } }); }
}
