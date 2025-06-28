import { DocumentBuilder, SwaggerDocumentOptions } from '@nestjs/swagger';
import { AuthModule } from '../../auth/auth.module';
import { UserModule } from '../../user/user.module';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Hello Identity API')
  .setDescription('API documentation for the Hello Identity microservice')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

export const swaggerOptions: SwaggerDocumentOptions = {
  include: [AuthModule, UserModule],
  deepScanRoutes: true,
};
