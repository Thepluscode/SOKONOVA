import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import * as Sentry from '@sentry/node';

@Catch()
export class SentryExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(SentryExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const message =
            exception instanceof HttpException
                ? exception.getResponse()
                : 'Internal server error';

        // Log error
        this.logger.error(
            `${request.method} ${request.url} - ${status}`,
            exception instanceof Error ? exception.stack : undefined,
        );

        // Report to Sentry for 5xx errors only
        if (status >= 500 && process.env.SENTRY_DSN) {
            Sentry.withScope((scope) => {
                scope.setTag('url', request.url);
                scope.setTag('method', request.method);
                scope.setTag('status', status.toString());
                scope.setUser({
                    id: (request as any).user?.id,
                    email: (request as any).user?.email,
                });
                scope.setExtra('body', request.body);
                scope.setExtra('query', request.query);
                scope.setExtra('params', request.params);
                Sentry.captureException(exception);
            });
        }

        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: typeof message === 'string' ? message : (message as any).message || message,
        });
    }
}
