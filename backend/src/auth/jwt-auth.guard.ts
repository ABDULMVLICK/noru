import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// On pose @UseGuards(JwtAuthGuard) sur une route pour exiger un JWT valide.
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
