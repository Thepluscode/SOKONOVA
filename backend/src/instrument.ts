// Sentry Instrumentation - import this FIRST in main.ts
import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

const SENTRY_DSN = process.env.SENTRY_DSN;

if (SENTRY_DSN) {
    Sentry.init({
        dsn: SENTRY_DSN,
        environment: process.env.NODE_ENV || 'development',
        release: process.env.npm_package_version,
        integrations: [
            nodeProfilingIntegration(),
        ],
        // Performance Monitoring
        tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
        // Profiling sample rate relative to tracesSampleRate
        profilesSampleRate: 1.0,
    });

    console.log('🔍 Sentry initialized');
} else {
    console.warn('⚠️ Sentry DSN not configured - error tracking disabled');
}

export { Sentry };
