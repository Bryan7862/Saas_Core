import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './jwt-payload.interface';
import { AuthService } from './auth.service'; // We'll use AuthService to validate user

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'defaultSecret',
        });
    }

    async validate(payload: JwtPayload) {
        // Fetch fresh user data with roles on every request
        const user = await this.authService.getUserWithRoles(payload.sub);
        if (!user) {
            return null; // or throw UnauthorizedException
        }
        return user; // { userId, email, roles: ['...'] }
    }
}
