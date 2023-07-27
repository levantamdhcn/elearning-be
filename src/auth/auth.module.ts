import { forwardRef, Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import {
  AtStrategy,
  RtStrategy,
  FacebookStrategy,
  GithubStrategy,
} from './strategis';

@Module({
  imports: [
    // https://docs.nestjs.com/fundamentals/circular-dependency#module-forward-reference
    forwardRef(() => UsersModule),
    JwtModule.register({}),
    CloudinaryModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AtStrategy,
    RtStrategy,
    FacebookStrategy,
    GithubStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
