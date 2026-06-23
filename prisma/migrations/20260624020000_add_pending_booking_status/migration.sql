-- Add PENDING to BookingStatus enum
ALTER TYPE "BookingStatus" ADD VALUE 'PENDING' BEFORE 'INTERESTED';

-- Update default
ALTER TABLE "Booking" ALTER COLUMN "status" SET DEFAULT 'PENDING'::"BookingStatus";
