import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

@Injectable()
export class AuthService {
  private accessSecret = process.env.JWT_ACCESS_SECRET || 'change_me';
  private refreshSecret = process.env.JWT_REFRESH_SECRET || 'change_me_refresh';
  private accessTtl = process.env.JWT_ACCESS_EXPIRES || '15m';
  private refreshTtl = process.env.JWT_REFRESH_EXPIRES || '30d';

  async validateUser(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return null;
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return null;
    return user;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, email: user.email };
    const accessToken = jwt.sign(payload, this.accessSecret, { expiresIn: this.accessTtl });
    const refreshToken = jwt.sign({ sub: user.id }, this.refreshSecret, { expiresIn: this.refreshTtl });

    // store refresh token hash
    const hash = await bcrypt.hash(refreshToken, 10);
    await prisma.refreshToken.create({ data: { userId: user.id, tokenHash: hash, revoked: false } });

    return { accessToken, refreshToken, expiresIn: this.accessTtl };
  }

  async refresh(refreshToken: string) {
    try {
      const decoded: any = jwt.verify(refreshToken, this.refreshSecret);
      const userId = decoded.sub as string;
      const tokens = await prisma.refreshToken.findMany({ where: { userId, revoked: false }, orderBy: { createdAt: 'desc' }, take: 5 });
      // verify against latest tokens
      for (const t of tokens) {
        const ok = await bcrypt.compare(refreshToken, t.tokenHash);
        if (ok) {
          // rotate
          await prisma.refreshToken.update({ where: { id: t.id }, data: { revoked: true } });
          const payload = { sub: userId };
          const newAccess = jwt.sign(payload, this.accessSecret, { expiresIn: this.accessTtl });
          const newRefresh = jwt.sign(payload, this.refreshSecret, { expiresIn: this.refreshTtl });
          const newHash = await bcrypt.hash(newRefresh, 10);
          await prisma.refreshToken.create({ data: { userId, tokenHash: newHash, revoked: false } });
          return { accessToken: newAccess, refreshToken: newRefresh, expiresIn: this.accessTtl };
        }
      }
      throw new UnauthorizedException('Refresh token revoked or not found');
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async revokeRefreshToken(refreshToken: string) {
    try {
      const decoded: any = jwt.verify(refreshToken, this.refreshSecret);
      const userId = decoded.sub as string;
      const tokens = await prisma.refreshToken.findMany({ where: { userId, revoked: false } });
      for (const t of tokens) {
        const ok = await bcrypt.compare(refreshToken, t.tokenHash);
        if (ok) {
          await prisma.refreshToken.update({ where: { id: t.id }, data: { revoked: true } });
          return;
        }
      }
    } catch (e) {}
  }
}
