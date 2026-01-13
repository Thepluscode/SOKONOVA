-- Add data payload to notifications for deep links and context
ALTER TABLE "Notification" ADD COLUMN IF NOT EXISTS "data" JSONB;
