import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCompetencyDto } from './dto/create-competency.dto';
import { CreateVersionDto } from './dto/create-version.dto';

@Injectable()
export class CompetencyService {
  constructor(private prisma: PrismaService) {}

  async list(framework?: string) {
    const where: any = {};
    if (framework) where['library'] = { isNot: null }; // simple placeholder filter
    const comps = await this.prisma.competency.findMany({ include: { currentVersion: true } });
    return comps;
  }

  async create(dto: CreateCompetencyDto) {
    const data: any = {
      code: dto.code,
      library: dto.libraryId ? { connect: { id: dto.libraryId } } : undefined,
    };
    const comp = await this.prisma.competency.create({ data });
    await this.prisma.auditLog.create({ data: { action: 'create', entity: 'Competency', entityId: comp.id } });
    return comp;
  }

  async get(id: string) {
    const comp = await this.prisma.competency.findUnique({ where: { id }, include: { currentVersion: true, versions: { orderBy: { versionNumber: 'desc' } } } });
    if (!comp) throw new NotFoundException('Competency not found');
    return comp;
  }

  async createVersion(id: string, dto: CreateVersionDto) {
    const comp = await this.prisma.competency.findUnique({ where: { id } });
    if (!comp) throw new NotFoundException('Competency not found');
    const last = await this.prisma.competencyVersion.findMany({ where: { competencyId: id }, orderBy: { versionNumber: 'desc' }, take: 1 });
    const versionNumber = last.length ? last[0].versionNumber + 1 : 1;
    const ver = await this.prisma.competencyVersion.create({ data: {
      competencyId: id,
      versionNumber,
      title: dto.title,
      summary: dto.summary,
      status: 'DRAFT',
    }});
    // create behavioral indicators
    if (dto.behavioralIndicators && dto.behavioralIndicators.length) {
      for (const bi of dto.behavioralIndicators) {
        await this.prisma.behavioralIndicator.create({ data: { competencyVersionId: ver.id, proficiencyLevel: bi.proficiencyLevel, text: bi.text } });
      }
    }
    await this.prisma.auditLog.create({ data: { action: 'create', entity: 'CompetencyVersion', entityId: ver.id } });
    return ver;
  }

  async publishVersion(id: string, vid: string) {
    // atomic transaction: set version.status to ACTIVE and competency.currentVersionId
    const ver = await this.prisma.competencyVersion.findUnique({ where: { id: vid } });
    if (!ver || ver.competencyId !== id) throw new BadRequestException('Version mismatch');
    const tx = await this.prisma.$transaction(async (pr) => {
      await pr.competencyVersion.update({ where: { id: vid }, data: { status: 'ACTIVE', effectiveDate: new Date() } });
      const comp = await pr.competency.update({ where: { id }, data: { currentVersionId: vid } });
      await pr.auditLog.create({ data: { action: 'publish', entity: 'CompetencyVersion', entityId: vid } });
      return comp;
    });
    return tx;
  }

  async archiveVersion(id: string, vid: string) {
    const ver = await this.prisma.competencyVersion.findUnique({ where: { id: vid } });
    if (!ver || ver.competencyId !== id) throw new BadRequestException('Version mismatch');
    await this.prisma.competencyVersion.update({ where: { id: vid }, data: { status: 'ARCHIVED' } });
    await this.prisma.auditLog.create({ data: { action: 'archive', entity: 'CompetencyVersion', entityId: vid } });
    return { ok: true };
  }
}
