import { prisma } from "@/lib/prisma";
import { ListingCard } from "@/components/ListingCard";
import { ListingFilters } from "@/components/ListingFilters";
import type { Prisma } from "@/generated/prisma/client";

interface SearchParams {
  province?: string;
  district?: string;
  saleMode?: string;
  minPrice?: string;
  maxPrice?: string;
  minArea?: string;
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const where: Prisma.ListingWhereInput = {
    status: "PUBLISHED",
  };

  if (params.province) {
    where.province = params.province;
  }
  if (params.district) {
    where.district = { contains: params.district };
  }
  if (params.saleMode === "WHOLE" || params.saleMode === "SUBDIVISION" || params.saleMode === "BOTH") {
    where.saleMode = params.saleMode;
  }
  if (params.minPrice || params.maxPrice) {
    where.wholeLandPrice = {
      ...(params.minPrice ? { gte: Number(params.minPrice) } : {}),
      ...(params.maxPrice ? { lte: Number(params.maxPrice) } : {}),
    };
  }
  if (params.minArea) {
    where.landArea = { gte: Number(params.minArea) };
  }

  const [listings, provinceRows] = await Promise.all([
    prisma.listing.findMany({
      where,
      include: { images: { orderBy: { order: "asc" }, take: 1 } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.listing.findMany({
      where: { status: "PUBLISHED" },
      distinct: ["province"],
      select: { province: true },
    }),
  ]);

  const provinces = provinceRows.map((p) => p.province).sort();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
          ตลาดที่ดิน
        </h1>
        <p className="mt-1 text-foreground/60">
          ค้นหาที่ดินสำหรับซื้อยกแปลงหรือแบ่งซื้อเป็นแปลงย่อย
        </p>
      </div>

      <div className="mb-6">
        <ListingFilters provinces={provinces} defaultValues={params} />
      </div>

      {listings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-primary-200 bg-white p-12 text-center text-foreground/60">
          ไม่พบประกาศที่ตรงกับเงื่อนไขที่เลือก
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={{
                id: listing.id,
                title: listing.title,
                province: listing.province,
                district: listing.district,
                landArea: listing.landArea,
                wholeLandPrice: listing.wholeLandPrice,
                saleMode: listing.saleMode,
                imageUrl: listing.images[0]?.url ?? null,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
