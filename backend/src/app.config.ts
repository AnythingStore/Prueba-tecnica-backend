import {
  UnauthorizedException,
  ValidationPipe,
} from '@nestjs/common';
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
export function aplicateGlobalConfiguration(app: INestApplication) {
  const isDebug = process.env.NODE_ENV == 'D';
  // Documentation
  const config = new DocumentBuilder()
    .setTitle('APP')
    .setDescription(
      'Una app para manejar los productos, registros de compras y ventas de un ecommerce',
    )
    .setVersion(process.env.CURRENT_VERSION ?? 'Beta')
    .addTag('Inventory')
    .addGlobalResponse({
      status: 500,
      description: 'Internal server error',
    })
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addSecurity('JWT-auth', {
      type: 'http',
      scheme: 'bearer',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  document.security = [{ 'JWT-auth': [] }];

  SwaggerModule.setup('api', app, document);

  app.use(helmet());

  const allowedOriginsMap: Record<string, true> = {
    'http://localhost:3000': true,
    'http://localhost:5173': true,
    'http://localhost': true,
    'http://localhost:3001': true,
  };

  const corsOptions = {
    origin: isDebug
      ? '*'
      : (origin, callback) => {
          if (!origin || allowedOriginsMap[origin]) {
            callback(null, true);
          } else {
            callback(new UnauthorizedException('Not allowed by CORS'));
          }
        },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  };

  app.enableCors(corsOptions);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      errorHttpStatusCode: 422,
    }),
  );
}