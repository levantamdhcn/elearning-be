// Nest dependencies
import { UnauthorizedException, BadRequestException } from '@nestjs/common';

// Other dependencies
import { JwtService } from '@nestjs/jwt';

export class JwtManipulationService {
  constructor(private jwtService: JwtService) {}

  public decodeJwtToken(token: string, property: string): any {
    let result;
    try {
      if (!token) throw new Error();
      let decodedJwtData;
      try {
        decodedJwtData = this.jwtService.verify(token.split(' ')[1], {
          secret: process.env.SERVER_TOKEN_SECRET,
        });
      } catch (error) {
        throw new BadRequestException('Token signature is not valid');
      }

      if (property === 'all') result = decodedJwtData;
      else result = decodedJwtData[property];
    } catch {
      throw new UnauthorizedException();
    }

    return result;
  }
}
