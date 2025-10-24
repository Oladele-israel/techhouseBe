import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { SecurityModule } from './module/security/security.module';
import { AuthModule } from "./api/auth/auth.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    SecurityModule,
    AuthModule,
  ],
})
export class AppModule {}
