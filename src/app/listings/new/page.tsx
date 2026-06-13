import { ListingForm } from "@/components/ListingForm";
import { createListing } from "@/lib/actions/listings";

export default function NewListingPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">ลงประกาศที่ดินใหม่</h1>
        <p className="mt-1 text-foreground/60">
          กรอกรายละเอียดที่ดิน จากนั้นเลือกบันทึกฉบับร่าง วิเคราะห์ความเป็นไปได้ หรือเผยแพร่ประกาศ
        </p>
      </div>
      <ListingForm action={createListing} />
    </div>
  );
}
