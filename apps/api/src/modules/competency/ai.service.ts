import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AiService {
  constructor(private prisma: PrismaService) {}

  async decodeKsao(text: string) {
    // mock implementation
    const job = await this.prisma.aiJob.create({ data: { provider: 'MOCK', prompt: { input: text }, status: 'done', response: { ksao: { knowledge: ['Example knowledge'], skills: ['Example skill'], abilities: [], attitudes: [] } } } });
    return job.response;
  }
}
