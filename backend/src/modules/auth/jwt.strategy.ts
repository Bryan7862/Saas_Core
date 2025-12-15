import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './jwt-payload.interface';
import { AuthService } from './auth.service'; // We'll use AuthService to validate user

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'defaultSecret',
        });
    }

    async validate(payload: JwtPayload) {
        // payload contains sub (userId) and email, etc.
        // Here we simply return the payload; the guard will attach it to request.user
        return { userId: payload.sub, email: payload.email };
    }
}
