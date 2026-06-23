"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

const PLOT_STATUSES = ["AVAILABLE", "RESERVED", "SOLD"] as const;
type PlotStatus = (typeof PLOT_STATUSES)[number];

export async function updatePlot(plotId: string, formData: FormData) {
  const plot = await prisma.plot.findUniqueOrThrow({
    where: { id: plotId },
    include: { project: true },
  });

  const rawStatus = formData.get("status");
  const status = (PLOT_STATUSES.includes(rawStatus as PlotStatus)
    ? rawStatus
    : plot.status) as PlotStatus;
  const price = Number(formData.get("price") ?? plot.price);

  await prisma.plot.update({
    where: { id: plotId },
    data: { status, price },
  });

  revalidatePath("/admin");
  revalidatePath(`/listings/${plot.project.listingId}`);
  revalidatePath(`/listings/${plot.project.listingId}/subdivision`);
}

export async function deletePlot(plotId: string) {
  const plot = await prisma.plot.findUniqueOrThrow({
    where: { id: plotId },
    include: { project: true },
  });

  await prisma.plot.delete({ where: { id: plotId } });

  revalidatePath("/admin");
  revalidatePath(`/listings/${plot.project.listingId}`);
  revalidatePath(`/listings/${plot.project.listingId}/subdivision`);
}
