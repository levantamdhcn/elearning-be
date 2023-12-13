import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class VisitorMiddleware implements NestMiddleware {
  private visitorCount = 0;

  use(req: Request, res: Response, next: NextFunction) {
    this.visitorCount++;
    console.log(`Visitor Count: ${this.visitorCount}`);
    next();
  }
}