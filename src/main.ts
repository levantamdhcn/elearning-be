import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';

const PORT = process.env.PORT;
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
    {
      cors: true,
      logger: ['error', 'warn', 'log'], // <--- Add this line in options object
    },
  );
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('E-Learning')
    .setDescription('E-Learning backend based on Express platform')
    .setVersion('0.0.1')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(PORT, () => {
    console.log('\x1b[46m%s\x1b[0m', `api: http://localhost:${PORT}/api`);
    console.log(
      '\x1b[45m%s\x1b[0m',
      `swagger: http://localhost:${PORT}/swagger`,
    );
  });
}
bootstrap();
