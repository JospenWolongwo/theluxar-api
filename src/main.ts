import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule } from '@nestjs/swagger';
import * as hbs from 'hbs';
import * as fs from 'fs';
import * as path from 'path';
import { join } from 'path';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { swaggerConfig, swaggerOptions } from './common/config/swagger.config';
import { nestCsrf } from 'ncsrf';

function registerPartialsRecursively(dir: string) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stats = fs.statSync(fullPath);
    if (stats.isDirectory()) {
      registerPartialsRecursively(fullPath);
    } else if (path.extname(file) === '.hbs') {
      const partialName = path.basename(file, '.hbs');
      const content = fs.readFileSync(fullPath, 'utf8');
      try {
        hbs.registerPartial(partialName, content);
      } catch (error) {
        console.error(`Failed to register partial ${partialName}:`, error);
      }
    }
  });
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const PORT = parseInt(process.env.PORT || '3000');
  const SITE_DOMAIN = process.env.SITE_DOMAIN || 'http://localhost';
  const baseUrl = `${SITE_DOMAIN}:${PORT}`;

  // Configure CORS for cross-origin requests with credentials
  const clientsStr = process.env.CLIENTS || '{}';
  const clients: Record<string, string> = JSON.parse(clientsStr);
  const allowedOrigins = Object.values(clients);
  if (!allowedOrigins.includes('http://localhost:4200')) {
    allowedOrigins.push('http://localhost:4200'); // Add Angular dev server as fallback
  }

  console.log('CORS configured with origins:', allowedOrigins);

  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true, // Important! This allows cookies to be included in cross-origin requests
  });

  // Middleware setup - Order is important!
  app.use(cookieParser());
  app.use(nestCsrf());

  // View engine setup
  const viewsPath = join(__dirname, '..', 'views');
  app.setBaseViewsDir(viewsPath);
  app.setViewEngine('hbs');

  // Register Handlebars helpers
  hbs.registerHelper('extend', function (name, options) {
    const contextWithBlocks = { ...this, blocks: {} };
    options.fn(contextWithBlocks); // Process inner content
    const layoutPath = path.join(viewsPath, 'layouts', `${name}.hbs`);
    const layout = fs.readFileSync(layoutPath, 'utf8');
    const template = hbs.handlebars.compile(layout);
    const output = template(contextWithBlocks);
    return new hbs.handlebars.SafeString(output);
  });

  hbs.registerHelper('content', function (name, options) {
    if (!this.blocks) this.blocks = {};
    this.blocks[name] = options.fn(this);
    return null;
  });

  hbs.registerHelper('block', function (name) {
    return this.blocks?.[name] || '';
  });

  hbs.registerHelper('eq', function (a, b) {
    return a === b;
  });

  // Register partials from views/partials directory
  const partialsPath = join(viewsPath, 'partials');
  if (fs.existsSync(partialsPath)) {
    registerPartialsRecursively(partialsPath);
  }

  // Static assets
  app.useStaticAssets(join(__dirname, '..', 'public'));

  // Pass baseUrl to all templates
  app.use((req, res, next) => {
    res.locals.baseUrl = baseUrl;
    next();
  });

  // Swagger API documentation
  const document = SwaggerModule.createDocument(
    app,
    swaggerConfig,
    swaggerOptions,
  );
  SwaggerModule.setup('api', app, document);

  await app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(
      `📚 API documentation available at http://localhost:${PORT}/api`,
    );
  });
}

bootstrap();
