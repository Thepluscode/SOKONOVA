"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./instrument");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./modules/app.module");
const common_1 = require("@nestjs/common");
const helmet_1 = require("helmet");
const sentry_exception_filter_1 = require("./common/filters/sentry-exception.filter");
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: [
            'http://localhost:3000',
            'http://localhost:5173',
            'http://localhost:54112',
            'https://sokonova-frontend-production.up.railway.app',
            'https://sokonova-backend-production.up.railway.app',
        ],
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
        credentials: true,
    });
    app.use((0, helmet_1.default)({
        crossOriginResourcePolicy: { policy: 'cross-origin' },
        crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
    }));
    app.use(morgan('dev'));
    app.use(cookieParser());
    app.use(express.json({
        verify: (req, res, buf) => {
            req.rawBody = buf.toString();
        },
    }));
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true }));
    app.useGlobalFilters(new sentry_exception_filter_1.SentryExceptionFilter());
    const port = process.env.PORT || 4001;
    await app.listen(port, '0.0.0.0');
    console.log(`🚀 Application is running on: http://0.0.0.0:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map