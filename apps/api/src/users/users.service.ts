import { Injectable, ConflictException } from '@nestjs/common'
import * as bcrypt from 'bcryptjs'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } })
  }

  async create(email: string, password: string) {
    const existing = await this.findByEmail(email)
    if (existing) throw new ConflictException('Email already in use')
    const passwordHash = await bcrypt.hash(password, 12)
    return this.prisma.user.create({ data: { email, passwordHash } })
  }

  async findOrCreateByGoogle(profile: {
    googleId: string
    email: string
  }): Promise<{ id: string; email: string }> {
    const byGoogleId = await this.prisma.user.findUnique({ where: { googleId: profile.googleId } })
    if (byGoogleId) return byGoogleId

    // Link to existing email/password account — preserves all associated applications
    const byEmail = await this.prisma.user.findUnique({ where: { email: profile.email } })
    if (byEmail) {
      return this.prisma.user.update({ where: { id: byEmail.id }, data: { googleId: profile.googleId } })
    }

    return this.prisma.user.create({ data: { email: profile.email, googleId: profile.googleId } })
  }
}
