-- AlterEnum: Add new role values and rename PROFESSOR → SPEAKER
-- This migration expands the Role enum for RINOMED 2026 official certificate types

-- Step 1: Add new enum values
ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'ASSISTANT_SURGICAL';
ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'ASSISTANT_VIRTUAL';
ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'SPEAKER';
ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'COMMITTEE';
ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'SPONSOR';

-- Step 2: Migrate existing PROFESSOR users to SPEAKER
UPDATE "User" SET "role" = 'SPEAKER' WHERE "role" = 'PROFESSOR';
