import { NestFactory } from "@nestjs/core"
import { ExecutionContext, ValidationPipe } from "@nestjs/common"
import { AppModule } from "./app.module"
import cookieParser from "cookie-parser"
import { SecurityService } from "./module/security/security.service"
import { AuthGuard } from "./common/guards/auth.guard"
import { AuthService } from "./api/auth/auth.service"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.use(cookieParser())

  app.enableCors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })

  const securityService = app.get(SecurityService);
  const authService = app.get(AuthService);

  app.useGlobalPipes(new ValidationPipe({ transform: true }))

  app.useGlobalGuards({
    canActivate(context: ExecutionContext) {
      const req = context.switchToHttp().getRequest();

      // Allow unauthenticated access to /auth routes
      if (req.path.startsWith('/auth')) return true;

      // guard instance manually with injected dependency
      const guard = new AuthGuard(securityService, authService);
      return guard.canActivate(context);
    },
  } as any);


  const port = process.env.PORT || 8000
  await app.listen(port)
  console.log(`Testora API running on http://localhost:${port}`)
}

bootstrap()
