import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import * as Sentry from '@sentry/node';

@Injectable()
export class MonitoringInterceptor implements NestInterceptor {
  private readonly logger = new Logger(MonitoringInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, ip, user } = request;
    const userAgent = request.get('user-agent') || '';
    const startTime = Date.now();

    // Set Sentry context for this request
    if (process.env.SENTRY_DSN) {
      Sentry.setContext('http', {
        method,
        url,
        ip,
        userAgent,
      });

      if (user) {
        Sentry.setUser({
          id: user.id,
          email: user.email,
          username: user.username || user.email,
        });
      }
    }

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        this.logger.log({
          message: 'HTTP Request Completed',
          method,
          url,
          duration: `${duration}ms`,
          userId: user?.id,
        });
      }),
      catchError((error) => {
        const duration = Date.now() - startTime;

        // Log error
        this.logger.error({
          message: 'HTTP Request Failed',
          method,
          url,
          duration: `${duration}ms`,
          error: error.message,
          stack: error.stack,
          userId: user?.id,
        });

        // Send error to Sentry
        if (process.env.SENTRY_DSN) {
          Sentry.captureException(error, {
            extra: {
              method,
              url,
              duration,
              userId: user?.id,
            },
          });
        }

        return throwError(() => error);
      }),
    );
  }
}
