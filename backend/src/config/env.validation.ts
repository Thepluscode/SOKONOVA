/**
 * Environment Variable Validation
 *
 * Validates required environment variables on application startup.
 * Fails fast if critical variables are missing to prevent runtime errors.
 */

interface EnvironmentConfig {
  // Database
  DATABASE_URL: string;

  // Server
  PORT?: string;
  NODE_ENV?: string;

  // Security
  JWT_SECRET: string;

  // Frontend
  FRONTEND_URL?: string;
  CORS_ORIGINS?: string;

  // Payment Providers (optional in development)
  STRIPE_SECRET_KEY?: string;
  STRIPE_PUBLIC_KEY?: string;
  PAYSTACK_SECRET_KEY?: string;
  FLUTTERWAVE_SECRET_KEY?: string;

  // Monitoring (optional)
  SENTRY_DSN?: string;

  // Email (optional in development)
  SENDGRID_API_KEY?: string;
  SENDGRID_FROM_EMAIL?: string;

  // Storage (optional in development)
  S3_ENDPOINT?: string;
  S3_ACCESS_KEY_ID?: string;
  S3_SECRET_ACCESS_KEY?: string;
  S3_BUCKET_NAME?: string;
}

const REQUIRED_VARS = [
  'DATABASE_URL',
  'JWT_SECRET',
];

const PRODUCTION_REQUIRED_VARS = [
  'STRIPE_SECRET_KEY',
  'SENTRY_DSN',
  'SENDGRID_API_KEY',
];

export function validateEnvironment(): EnvironmentConfig {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check required variables
  for (const varName of REQUIRED_VARS) {
    if (!process.env[varName]) {
      errors.push(`Missing required environment variable: ${varName}`);
    }
  }

  // Check JWT_SECRET strength
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    errors.push('JWT_SECRET must be at least 32 characters long');
  }

  if (
    process.env.JWT_SECRET &&
    (process.env.JWT_SECRET === 'your-jwt-secret' ||
      process.env.JWT_SECRET.includes('change-in-production'))
  ) {
    errors.push('JWT_SECRET must be changed from default placeholder');
  }

  // Check production-specific variables
  if (process.env.NODE_ENV === 'production') {
    for (const varName of PRODUCTION_REQUIRED_VARS) {
      if (!process.env[varName]) {
        warnings.push(`Missing production variable: ${varName}`);
      }
    }

    // Verify using live keys, not test keys
    if (process.env.STRIPE_SECRET_KEY?.includes('test')) {
      errors.push('STRIPE_SECRET_KEY must use live key (sk_live_...) in production');
    }
  }

  // Log warnings
  if (warnings.length > 0) {
    console.warn('\n⚠️  Environment Configuration Warnings:');
    warnings.forEach(warning => console.warn(`  - ${warning}`));
    console.warn('');
  }

  // Fail if errors
  if (errors.length > 0) {
    console.error('\n❌ Environment Configuration Errors:');
    errors.forEach(error => console.error(`  - ${error}`));
    console.error('\nApplication startup aborted. Please fix the above errors.\n');
    process.exit(1);
  }

  console.log('✅ Environment variables validated successfully');

  return process.env as unknown as EnvironmentConfig;
}
