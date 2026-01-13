"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./instrument");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./modules/app.module");
const common_1 = require("@nestjs/common");
const helmet_1 = require("helmet");
const sentry_exception_filter_1 = require("./common/filters/sentry-exception.filter");
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use((0, helmet_1.default)());
    app.use(morgan('dev'));
    app.use(cookieParser());
    app.enableCors({
        origin: [
            /localhost:3000$/,
            /localhost:54112$/,
            /localhost:\d+$/,
            'https://sokonova-frontend-production.up.railway.app',
            /\.up\.railway\.app$/
        ],
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true }));
    app.useGlobalFilters(new sentry_exception_filter_1.SentryExceptionFilter());
    const port = process.env.PORT || 4001;
    await app.listen(port, '0.0.0.0');
    console.log(`🚀 Application is running on: http://0.0.0.0:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map