import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../user/repository/userRespository';
import { loginDto, SignupDto } from './dto/auth.dto';
import { hash, verify } from '@/utils/security/security';
import { SecurityService } from '@/module/security/security.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepo: UserRepository,
        private readonly securityService: SecurityService
    ) { }


    public async signup(data: SignupDto) {

        const exitingUser = await this.userRepo.findByEmail(data.email)
        if (exitingUser) throw new BadRequestException('user already exists please login')

        const hashedPass = await hash(data.password)

        const newUser = await this.userRepo.createUser({
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                isActive: true,
                role: data.role,
                password: hashedPass,
            }
        })

        const tokens = await this.securityService.generateTokens({ sub: newUser.id, role: newUser.role })
        await this.storeRefreshToken(newUser.id, tokens.refreshToken)
        // lets handle the authentication and token issuance
        return { user: newUser, tokens }
    }

    public async login(data: loginDto) {
        const user = await this.userRepo.findByEmail(data.email)
        if (!user) throw new UnauthorizedException('user not found in records')

        const isPasswordOk = await verify(user.password, data.password)
        if (!isPasswordOk) throw new UnauthorizedException("incorrect password!")

        const tokens = await this.securityService.generateTokens({ sub: user.id, role: user.role })
        console.log("******these are the tokens*****", tokens)
        await this.storeRefreshToken(user.id, tokens.refreshToken)
        return { user: user, tokens }
    }

    async refresh(userId: string, providedRefreshToken: string) {
        const user = await this.userRepo.findById(userId);
        if (!user || !user.refreshTokenHash) throw new UnauthorizedException('Invalid session');

        const valid = await verify(providedRefreshToken, user.refreshTokenHash);
        if (!valid) {
            // possible replay or theft; revoke
            await this.userRepo.updateRefreshTokenHash(user.id, null);
            throw new UnauthorizedException('Invalid refresh token');
        }

        // valid -> rotate
        const tokens = await this.securityService.generateTokens({ sub: user.id, role: user.role })
        await this.storeRefreshToken(user.id, tokens.refreshToken);
        return tokens;
    }



    private async storeRefreshToken(userId: string, refreshToken: string) {
        const hashed = await hash(refreshToken);
        await this.userRepo.updateRefreshTokenHash(userId, hashed);
    }
}
