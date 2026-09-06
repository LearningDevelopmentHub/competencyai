import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('ai')
export class AiController {
  constructor(private readonly ai: AiService) {}

  @UseGuards(JwtAuthGuard)
  @Post('ksao-decode')
  async decode(@Body() body: { text: string }) {
    return this.ai.decodeKsao(body.text);
  }
}
