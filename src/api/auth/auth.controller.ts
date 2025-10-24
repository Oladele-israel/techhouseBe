import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { loginDto, SignupDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { setAuthCookies } from '@/utils/security/security';
import { AuthGuard } from '@/common/guards/auth.guard';
import { CurrentUser } from '@/common/decorators/currentUser.decorator';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @Post('signup')
    async signup(@Body() data: SignupDto, @Res({ passthrough: true }) res: Response) {
        const { user, tokens } = await this.authService.signup(data)
        await setAuthCookies(res, tokens)
        return user;
    }

    @Post('login')
    async login(@Body() dto: loginDto, @Res({ passthrough: true }) res: Response) {
        const { user, tokens } = await this.authService.login(dto);
        await setAuthCookies(res, tokens);
        return { user };
    }

    // this is for test
    @UseGuards(AuthGuard)
    @Get('profile')
    async getProfile(@CurrentUser() user: any) {
        console.log(user)
        return {
            message: 'Access granted. You are authenticated!',
            user,
        };
    }



}
