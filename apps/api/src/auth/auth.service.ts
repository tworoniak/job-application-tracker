import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs'
import { UsersService } from '../users/users.service'

export interface JwtPayload {
  id: string
  email: string
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string): Promise<JwtPayload> {
    const user = await this.usersService.findByEmail(email)
    if (!user) throw new UnauthorizedException('Invalid credentials')
    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) throw new UnauthorizedException('Invalid credentials')
    return { id: user.id, email: user.email }
  }

  async register(email: string, password: string): Promise<JwtPayload> {
    const user = await this.usersService.create(email, password)
    return { id: user.id, email: user.email }
  }

  signToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload)
  }

  verifyToken(token: string): JwtPayload | null {
    try {
      return this.jwtService.verify<JwtPayload>(token)
    } catch {
      return null
    }
  }
}
