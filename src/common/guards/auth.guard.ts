import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { SecurityService } from '@/module/security/security.service';
import { AuthService } from '@/api/auth/auth.service';
import { setAuthCookies } from '@/utils/security/security';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly securityService: SecurityService,
        private readonly authService: AuthService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest<Request>();
        const res = context.switchToHttp().getResponse<Response>();

        const accessToken = req.cookies?.access;
        const refreshToken = req.cookies?.refresh;

        if (!accessToken) throw new UnauthorizedException('Access token not found');

        try {
            const payload = await this.securityService.verifyToken(accessToken, false);
            req.user = payload;
            return true;
        } catch (error: any) {
            if (error.message?.includes('expired')) {
                if (!refreshToken) throw new UnauthorizedException('Session expired');

                try {
                    const decoded = await this.securityService.verifyToken(refreshToken, true);
                    const userId = decoded.sub;

                    const newTokens = await this.authService.refresh(userId, refreshToken);

                    await setAuthCookies(res, newTokens);

                    const newPayload = await this.securityService.verifyToken(
                        newTokens.accessToken,
                        false,
                    );
                    req.user = newPayload;

                    return true;
                } catch {
                    throw new UnauthorizedException('Session expired or invalid');
                }
            }

            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}
