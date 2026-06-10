import { Controller, Get, Query, Res } from '@nestjs/common'
import { AuthService } from './auth.service'
import { UsersService } from '../users/users.service'

const isProd = process.env.NODE_ENV === 'production'

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProd,
  sameSite: (isProd ? 'none' : 'lax') as 'none' | 'lax',
  path: '/',
  maxAge: 60 * 60 * 24 * 7,
}

@Controller('auth/google')
export class GoogleAuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  googleLogin(@Res() res: any): void {
    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      redirect_uri: process.env.GOOGLE_CALLBACK_URL!,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'online',
    })
    res.code(302).header('location', `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`).send()
  }

  @Get('callback')
  async googleCallback(@Query('code') code: string, @Res() res: any): Promise<void> {
    const clientUrl = process.env.CLIENT_URL ?? 'http://localhost:5173'
    try {
      const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: process.env.GOOGLE_CLIENT_ID!,
          client_secret: process.env.GOOGLE_CLIENT_SECRET!,
          redirect_uri: process.env.GOOGLE_CALLBACK_URL!,
          grant_type: 'authorization_code',
        }),
      })
      const tokens = await tokenRes.json() as { access_token: string }

      const profileRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      })
      const profile = await profileRes.json() as { id: string; email: string }

      if (!profile.email) throw new Error('No email returned from Google')

      const user = await this.usersService.findOrCreateByGoogle({
        googleId: profile.id,
        email: profile.email,
      })

      const token = this.authService.signToken({ id: user.id, email: user.email })
      res.setCookie('access_token', token, COOKIE_OPTIONS)
      res.code(302).header('location', `${clientUrl}/auth/callback#token=${token}`).send()
    } catch {
      res.code(302).header('location', `${clientUrl}/login?error=oauth_failed`).send()
    }
  }
}
