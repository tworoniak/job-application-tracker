import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: process.env.NODE_ENV !== 'production' }),
  )

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }))

  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
    credentials: true,
  })

  app.getHttpAdapter().get('/health', (_req: unknown, res: { status: (code: number) => { send: (body: string) => void } }) => {
    res.status(200).send('ok')
  })

  const port = process.env.PORT ?? 3000
  await app.listen(port, '0.0.0.0')
  console.log(`API running → http://localhost:${port}/graphql`)
}

bootstrap()
