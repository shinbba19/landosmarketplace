-- Create new enum first
CREATE TYPE "BookingStatus_new" AS ENUM ('INTERESTED', 'VIEWING', 'RESERVED', 'CANCELLED');

-- Convert column to text, then map old values, then cast to new enum
ALTER TABLE "Booking" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Booking" ALTER COLUMN "status" TYPE text;

UPDATE "Booking" SET "status" = 'INTERESTED' WHERE "status" = 'PENDING';
UPDATE "Booking" SET "status" = 'RESERVED' WHERE "status" = 'APPROVED';
UPDATE "Booking" SET "status" = 'CANCELLED' WHERE "status" = 'REJECTED';

ALTER TABLE "Booking" ALTER COLUMN "status" TYPE "BookingStatus_new" USING ("status"::"BookingStatus_new");

-- Drop old enum and rename
DROP TYPE "BookingStatus";
ALTER TYPE "BookingStatus_new" RENAME TO "BookingStatus";

-- Set new default
ALTER TABLE "Booking" ALTER COLUMN "status" SET DEFAULT 'INTERESTED'::"BookingStatus";
