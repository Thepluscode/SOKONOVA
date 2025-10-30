import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Only enable in production
  enabled: process.env.NODE_ENV === 'production',

  // Filter out sensitive data
  beforeSend(event, hint) {
    // Don't send authentication tokens or sensitive headers
    if (event.request?.headers) {
      delete event.request.headers['authorization'];
      delete event.request.headers['cookie'];
      delete event.request.headers['set-cookie'];
    }

    // Filter sensitive query parameters
    if (event.request?.query_string) {
      const url = new URL(`http://localhost${event.request.url}`);
      url.searchParams.delete('token');
      url.searchParams.delete('key');
      url.searchParams.delete('secret');
      event.request.query_string = url.search.slice(1);
    }

    return event;
  },
});
