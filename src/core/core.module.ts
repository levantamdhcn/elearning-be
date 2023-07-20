import { Module, MiddlewareConsumer } from '@nestjs/common';

import { UserModule } from './User/user.module';
import { AuthModule } from './Auth/auth.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [UserModule, AuthModule, CloudinaryModule],
})
export class CoreModule {
  //   configure(consumer: MiddlewareConsumer) {
  //     consumer
  //       .apply(BlacklistMiddleware)
  //       .forRoutes('v1/auth/check-token', 'v1/auth/signout');
  //   }
}
