import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { parsePerspectiveImages } from "@/lib/subdivision";
import { SubdivisionExplorer } from "@/components/SubdivisionExplorer";

export default async function SubdivisionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      subdivision: {
        include: { plots: { orderBy: { label: "asc" } } },
      },
    },
  });

  if (!listing || !listing.subdivision) notFound();

  const plots = listing.subdivision.plots.map((plot) => ({
    id: plot.id,
    label: plot.label,
    points: plot.points,
    status: plot.status,
    area: plot.area,
    width: plot.width,
    depth: plot.depth,
    price: plot.price,
    perspectiveImages: parsePerspectiveImages(plot.perspectiveImages),
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <Link
          href={`/listings/${listing.id}`}
          className="text-sm font-medium text-primary-700 hover:underline"
        >
          ← กลับไปหน้ารายละเอียดที่ดิน
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">
          แผนผังแบ่งแปลง
        </h1>
        <p className="mt-1 text-foreground/60">{listing.title}</p>
      </div>

      <SubdivisionExplorer plots={plots} />
    </div>
  );
}
