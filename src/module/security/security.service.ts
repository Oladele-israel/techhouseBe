import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class SecurityService {

    constructor(private readonly jwt: JwtService) { }


    public async generateTokens(
        payload: Record<string, any>,
        options?: {
            accessExpiresIn?: string;
            refreshExpiresIn?: string;
        },
    ) {
        const accessToken = await this.jwt.signAsync(payload, {
            algorithm: 'RS256',
            expiresIn: options?.accessExpiresIn || process.env.JWT_ACCESS_EXPIRES_IN || '15m',
            privateKey: process.env.JWT_ACCESS_PRIVATE_KEY,
        } as any);

        const refreshPayload = {
            ...payload,
            tokenKind: 'refresh',
        };

        const refreshToken = await this.jwt.signAsync(refreshPayload, {
            algorithm: 'RS256',
            expiresIn: options?.refreshExpiresIn || process.env.JWT_REFRESH_EXPIRES_IN || '7d',
            privateKey: process.env.JWT_REFRESH_PRIVATE_KEY,
        } as any);

        return { accessToken, refreshToken };
    }

    /**
   * Verifies a JWT using the correct public key.
   * @param token JWT token to verify
   * @param isRefresh Whether it’s a refresh token
   * @returns The verified payload if valid
   */
    async verifyToken(token: string, isRefresh = false): Promise<any> {
        try {
            const publicKey = isRefresh
                ? process.env.JWT_REFRESH_PUBLIC_KEY
                : process.env.JWT_ACCESS_PUBLIC_KEY;

            const decoded = await this.jwt.verifyAsync(token, {
                algorithms: ['RS256'],
                publicKey,
            } as any);

            return decoded;
        } catch (err) {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }

    /**
     * Decodes a token without verifying its signature.
     * Use this for debugging or non-sensitive reads only.
     */
    decodeToken(token: string): any {
        return this.jwt.decode(token);
    }

      /**
   * Verifies a refresh token and issues new access & refresh tokens.
   */
    async refreshTokens(refreshToken: string) {
        try {
            const decoded = await this.verifyToken(refreshToken, true);

            // Ensure token is truly a refresh token
            if (decoded.tokenKind !== 'refresh') {
                throw new UnauthorizedException('Invalid token type');
            }

            // Create a clean payload for the new tokens (exclude tokenKind)
            const { tokenKind, iat, exp, ...restPayload } = decoded;

            // Generate new token pair
            const newTokens = await this.generateTokens(restPayload);

            return newTokens;
        } catch (err) {
            throw new UnauthorizedException('Could not refresh tokens');
        }
    }

}
