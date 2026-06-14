-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "listingId" TEXT,
ALTER COLUMN "plotId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
