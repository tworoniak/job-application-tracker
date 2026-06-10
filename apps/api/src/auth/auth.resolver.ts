import { Resolver, Mutation, Query, Args, Context } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { JwtAuthGuard } from './jwt-auth.guard'
import { CurrentUser } from './current-user.decorator'
import { AuthUser } from './models/auth-user.model'
import type { JwtPayload } from './auth.service'

const isProd = process.env.NODE_ENV === 'production'

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProd,
  sameSite: (isProd ? 'none' : 'lax') as 'none' | 'lax',
  path: '/',
  maxAge: 60 * 60 * 24 * 7,
}

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthUser)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
    @Context() ctx: any,
  ): Promise<JwtPayload & { token: string }> {
    const user = await this.authService.login(email, password)
    const token = this.authService.signToken(user)
    ctx.res.setCookie('access_token', token, COOKIE_OPTIONS)
    return { ...user, token }
  }

  @Mutation(() => AuthUser)
  async register(
    @Args('email') email: string,
    @Args('password') password: string,
    @Context() ctx: any,
  ): Promise<JwtPayload & { token: string }> {
    const user = await this.authService.register(email, password)
    const token = this.authService.signToken(user)
    ctx.res.setCookie('access_token', token, COOKIE_OPTIONS)
    return { ...user, token }
  }

  @Mutation(() => Boolean)
  logout(@Context() ctx: any): boolean {
    ctx.res.clearCookie('access_token', { path: '/' })
    return true
  }

  @Query(() => AuthUser, { nullable: true })
  me(@Context() ctx: any): (JwtPayload & { token: null }) | null {
    const cookieToken = ctx.req.cookies?.access_token
    const authHeader = ctx.req.headers?.authorization as string | undefined
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null
    const token = cookieToken ?? bearerToken
    if (!token) return null
    const payload = this.authService.verifyToken(token)
    if (!payload) return null
    return { ...payload, token: null }
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => AuthUser)
  currentUser(@CurrentUser() user: JwtPayload): JwtPayload {
    return user
  }
}
