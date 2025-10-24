import { Module } from '@nestjs/common';
import { SecurityService } from './security.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule,],
  providers: [SecurityService],
  exports:[SecurityService]
})
export class SecurityModule {}
