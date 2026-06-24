import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { FeasibilityForm } from "@/components/FeasibilityForm";
import { FeasibilityResult } from "@/components/FeasibilityResult";
import { runFeasibility } from "@/lib/actions/feasibility";

export default async function FeasibilityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      subdivision: { include: { plots: true } },
      feasibilities: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  if (!listing) notFound();

  const latestAnalysis = listing.feasibilities[0];

  const defaults = latestAnalysis
    ? {
        landArea: latestAnalysis.landArea,
        wholeLandPrice: latestAnalysis.wholeLandPrice,
        wholeLandSalePrice: latestAnalysis.wholeLandSalePrice,
        numberOfPlots: latestAnalysis.numberOfPlots,
        pricePerSqWah: latestAnalysis.pricePerSqWah,
      }
    : {
        landArea: listing.landArea,
        wholeLandPrice: 0,
        wholeLandSalePrice: listing.wholeLandPrice,
        numberOfPlots: 0,
        pricePerSqWah: 0,
      };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">วิเคราะห์ความเป็นไปได้</h1>
        <p className="mt-1 text-foreground/60">{listing.title}</p>
      </div>

      <div className="flex flex-col gap-6">
        <FeasibilityForm action={runFeasibility.bind(null, listing.id)} defaults={defaults} />

        {latestAnalysis && (
          <FeasibilityResult
            listingId={listing.id}
            listingStatus={listing.status}
            analysis={latestAnalysis}
          />
        )}
      </div>
    </div>
  );
}
