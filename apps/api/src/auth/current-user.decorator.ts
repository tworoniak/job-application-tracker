import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import type { JwtPayload } from './auth.service'

export const CurrentUser = createParamDecorator(
  (_: unknown, context: ExecutionContext): JwtPayload => {
    const ctx = GqlExecutionContext.create(context)
    return ctx.getContext().req.user
  },
)
