"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { defaultPerspectiveImages } from "@/lib/subdivision";
import { uploadListingImages } from "@/lib/actions/uploads";

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
  revalidatePath(`/admin/listings/${plot.project.listingId}/subdivision`);
  revalidatePath(`/listings/${plot.project.listingId}`);
  revalidatePath(`/listings/${plot.project.listingId}/subdivision`);
}

export async function createPlot(projectId: string, formData: FormData) {
  const project = await prisma.subdivisionProject.findUniqueOrThrow({
    where: { id: projectId },
  });

  const label = String(formData.get("label") ?? "").trim();
  const area = Number(formData.get("area") ?? 100);
  const price = Number(formData.get("price") ?? 0);
  const side = Math.round(Math.sqrt(area));

  await prisma.plot.create({
    data: {
      projectId,
      label: label || `P${Date.now() % 1000}`,
      area,
      width: side,
      depth: area > 0 ? Math.round(area / side) : side,
      price,
      status: "AVAILABLE",
      points: "0,0 25,0 25,25 0,25",
      perspectiveImages: defaultPerspectiveImages(`${project.listingId}-${label.toLowerCase()}`),
    },
  });

  revalidatePath("/admin");
  revalidatePath(`/admin/listings/${project.listingId}/subdivision`);
  revalidatePath(`/listings/${project.listingId}`);
  revalidatePath(`/listings/${project.listingId}/subdivision`);
}

export async function updateBoundary(projectId: string, formData: FormData) {
  const project = await prisma.subdivisionProject.findUniqueOrThrow({
    where: { id: projectId },
  });

  const boundaryPoints = String(formData.get("boundaryPoints") ?? "").trim() || null;

  const surveyFiles = formData
    .getAll("surveyImageFile")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);

  let surveyImageUrl: string | undefined;
  if (surveyFiles.length > 0) {
    const urls = await uploadListingImages(surveyFiles, `listings/${project.listingId}/survey`);
    surveyImageUrl = urls[0];
  }

  await prisma.subdivisionProject.update({
    where: { id: projectId },
    data: {
      boundaryPoints,
      ...(surveyImageUrl && { surveyImageUrl }),
    },
  });

  revalidatePath("/admin");
  revalidatePath(`/admin/listings/${project.listingId}/subdivision`);
  revalidatePath(`/listings/${project.listingId}`);
  revalidatePath(`/listings/${project.listingId}/subdivision`);
}
