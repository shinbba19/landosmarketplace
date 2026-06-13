import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ListingForm } from "@/components/ListingForm";
import { updateListing } from "@/lib/actions/listings";

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: { images: { orderBy: { order: "asc" } } },
  });

  if (!listing) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">แก้ไขประกาศ</h1>
        <p className="mt-1 text-foreground/60">{listing.title}</p>
      </div>
      <ListingForm
        action={updateListing.bind(null, listing.id)}
        initialValues={{
          title: listing.title,
          province: listing.province,
          district: listing.district,
          subdistrict: listing.subdistrict,
          landArea: listing.landArea,
          lat: listing.lat,
          lng: listing.lng,
          wholeLandPrice: listing.wholeLandPrice,
          description: listing.description,
          saleMode: listing.saleMode,
          images: listing.images.map((img) => img.url),
        }}
        submitLabels={{ publish: listing.status === "PUBLISHED" ? "บันทึกการเปลี่ยนแปลง" : "เผยแพร่ประกาศ" }}
      />
    </div>
  );
}
