import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SecurityModule } from '@/module/security/security.module';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';

@Module({
  imports:[SecurityModule,JwtModule,UserModule],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
