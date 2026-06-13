"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { calculateFeasibility, type FeasibilityInputs } from "@/lib/feasibility";

export async function runFeasibility(listingId: string, formData: FormData) {
  const inputs: FeasibilityInputs = {
    landArea: Number(formData.get("landArea") ?? 0),
    wholeLandPrice: Number(formData.get("wholeLandPrice") ?? 0),
    numberOfPlots: Number(formData.get("numberOfPlots") ?? 0),
    pricePerSqWah: Number(formData.get("pricePerSqWah") ?? 0),
  };

  const outputs = calculateFeasibility(inputs);

  await prisma.feasibilityAnalysis.create({
    data: { listingId, ...inputs, ...outputs },
  });

  revalidatePath(`/listings/${listingId}/feasibility`);
}
