-- Add notification preference columns to User table
ALTER TABLE "User" ADD COLUMN "shopBio" TEXT;
ALTER TABLE "User" ADD COLUMN "notifyEmail" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "User" ADD COLUMN "notifySms" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "User" ADD COLUMN "notifyPush" BOOLEAN NOT NULL DEFAULT true;