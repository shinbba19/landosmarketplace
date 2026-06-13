import Image from "next/image";
import Link from "next/link";
import { formatCurrency, formatNumber, SALE_MODE_LABELS } from "@/lib/format";

export interface ListingCardData {
  id: string;
  title: string;
  province: string;
  district: string;
  landArea: number;
  wholeLandPrice: number;
  saleMode: string;
  imageUrl: string | null;
}

export function ListingCard({ listing }: { listing: ListingCardData }) {
  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-primary-100 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-primary-50">
        {listing.imageUrl && (
          <Image
            src={listing.imageUrl}
            alt={listing.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            unoptimized
          />
        )}
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-primary-700 shadow-sm">
          {SALE_MODE_LABELS[listing.saleMode] ?? listing.saleMode}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="line-clamp-2 font-semibold text-foreground">{listing.title}</h3>
        <p className="text-sm text-foreground/60">
          {listing.district}, {listing.province}
        </p>
        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="text-foreground/70">{formatNumber(listing.landArea)} ไร่</span>
          <span className="font-bold text-primary-700">
            {formatCurrency(listing.wholeLandPrice)}
          </span>
        </div>
      </div>
    </Link>
  );
}
