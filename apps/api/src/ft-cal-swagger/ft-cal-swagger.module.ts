import { INestApplication, Module } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  SWAGGER_DOCUMENT_DESCRIPTION,
  SWAGGER_DOCUMENT_ROUTE,
  SWAGGER_DOCUMENT_TITLE,
  SWAGGER_DOCUMENT_VERSION,
} from '../common/constants/swagger/main.js';

@Module({})
export class FtCalSwaggerModule {
  static setup(app: INestApplication) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle(SWAGGER_DOCUMENT_TITLE)
      .setDescription(SWAGGER_DOCUMENT_DESCRIPTION)
      .setVersion(SWAGGER_DOCUMENT_VERSION)
      .addBasicAuth()
      .build();
    const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup(SWAGGER_DOCUMENT_ROUTE, app, swaggerDocument);
  }
}
