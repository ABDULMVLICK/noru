import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

// Lit le JWT dans le header "Authorization: Bearer <token>", vérifie sa
// signature avec la clé secrète, et son expiration.
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
    });
  }

  // La valeur retournée ici est injectée dans req.user.
  validate(payload: { sub: number; email: string; role: string }) {
    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}
