"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ROLE_USER_EMAIL } from "@/lib/roles";
import { PLOT_LABELS, PLOT_POINTS, defaultPerspectiveImages } from "@/lib/subdivision";
import { uploadListingImages } from "@/lib/actions/uploads";
import { generatePlotsInBoundary } from "@/lib/boundary-layout";

const SALE_MODES = ["WHOLE", "SUBDIVISION", "BOTH"] as const;
type SaleMode = (typeof SALE_MODES)[number];

function parseListingFields(formData: FormData) {
  return {
    title: String(formData.get("title") ?? "").trim(),
    province: String(formData.get("province") ?? "").trim(),
    district: String(formData.get("district") ?? "").trim(),
    subdistrict: String(formData.get("subdistrict") ?? "").trim(),
    landArea: Number(formData.get("landArea") ?? 0),
    lat: Number(formData.get("lat") ?? 0),
    lng: Number(formData.get("lng") ?? 0),
    wholeLandPrice: Number(formData.get("wholeLandPrice") ?? 0),
    description: String(formData.get("description") ?? "").trim(),
    saleMode: (SALE_MODES.includes(formData.get("saleMode") as SaleMode)
      ? formData.get("saleMode")
      : "WHOLE") as SaleMode,
  };
}

function parseImageUrls(formData: FormData): string[] {
  const raw = String(formData.get("images") ?? "");
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseImageFiles(formData: FormData): File[] {
  return formData
    .getAll("imageFiles")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);
}

interface PlotFormInput {
  label: string;
  area: number;
  price: number;
  imageFiles: File[];
}

function parsePlotInputs(formData: FormData): PlotFormInput[] {
  const count = Number(formData.get("plotCount") ?? 0);
  if (count <= 0) return [];
  const plots: PlotFormInput[] = [];
  for (let i = 0; i < count; i++) {
    const imageFiles = formData
      .getAll(`plot_images_${i}`)
      .filter((entry): entry is File => entry instanceof File && entry.size > 0);
    plots.push({
      label: String(formData.get(`plot_label_${i}`) ?? `P${i + 1}`),
      area: Number(formData.get(`plot_area_${i}`) ?? 100),
      price: Number(formData.get(`plot_price_${i}`) ?? 0),
      imageFiles,
    });
  }
  return plots;
}

interface BoundaryInput {
  boundaryPoints: string | null;
  surveyImageUrl: string | null;
}

async function parseBoundaryInput(formData: FormData, listingId: string): Promise<BoundaryInput> {
  const boundaryPoints = String(formData.get("boundaryPoints") ?? "").trim() || null;

  const surveyFiles = formData
    .getAll("surveyImageFile")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);

  let surveyImageUrl: string | null = null;
  if (surveyFiles.length > 0) {
    const urls = await uploadListingImages(surveyFiles, `listings/${listingId}/survey`);
    surveyImageUrl = urls[0] ?? null;
  }

  return { boundaryPoints, surveyImageUrl };
}

async function ensureSubdivisionProject(
  listingId: string,
  wholeLandPrice: number,
  plotInputs?: PlotFormInput[],
  boundary?: BoundaryInput,
) {
  const existing = await prisma.subdivisionProject.findUnique({
    where: { listingId },
  });
  if (existing) {
    const updateData: Record<string, unknown> = {};
    if (boundary?.boundaryPoints !== undefined) updateData.boundaryPoints = boundary.boundaryPoints;
    if (boundary?.surveyImageUrl) updateData.surveyImageUrl = boundary.surveyImageUrl;
    if (Object.keys(updateData).length > 0) {
      await prisma.subdivisionProject.update({ where: { id: existing.id }, data: updateData });
    }
    return existing;
  }

  const project = await prisma.subdivisionProject.create({
    data: {
      listingId,
      boundaryPoints: boundary?.boundaryPoints ?? null,
      surveyImageUrl: boundary?.surveyImageUrl ?? null,
      roadCost: 0,
      infrastructureCost: 0,
      marketingCost: 0,
    },
  });

  const plotsToCreate = plotInputs && plotInputs.length > 0 ? plotInputs : PLOT_LABELS.map((label) => ({
    label,
    area: 100,
    price: Math.round((wholeLandPrice || 8_000_000) / PLOT_LABELS.length),
    imageFiles: [] as File[],
  }));

  // Generate plot coordinates inside boundary if available
  const generatedPoints = boundary?.boundaryPoints
    ? generatePlotsInBoundary(boundary.boundaryPoints, plotsToCreate.length)
    : [];

  for (let idx = 0; idx < plotsToCreate.length; idx++) {
    const p = plotsToCreate[idx];
    let perspectiveImages: string;

    if (p.imageFiles.length > 0) {
      const urls = await uploadListingImages(
        p.imageFiles,
        `listings/${listingId}/plots/${p.label.toLowerCase()}`,
      );
      perspectiveImages = JSON.stringify(
        urls.map((url, i) => ({ label: `ภาพที่ ${i + 1}`, url })),
      );
    } else {
      perspectiveImages = defaultPerspectiveImages(`${listingId}-${p.label.toLowerCase()}`);
    }

    const points = generatedPoints[idx] ?? PLOT_POINTS[p.label] ?? "0,0 25,0 25,25 0,25";
    const side = Math.round(Math.sqrt(p.area));
    await prisma.plot.create({
      data: {
        projectId: project.id,
        label: p.label,
        area: p.area,
        width: side,
        depth: p.area > 0 ? Math.round(p.area / side) : side,
        price: p.price,
        status: "AVAILABLE",
        points,
        perspectiveImages,
      },
    });
  }

  return project;
}

export async function createListing(formData: FormData) {
  const fields = parseListingFields(formData);
  const images = parseImageUrls(formData);
  const imageFiles = parseImageFiles(formData);
  const plotInputs = parsePlotInputs(formData);
  const intent = String(formData.get("intent") ?? "draft");

  const owner = await prisma.user.findUniqueOrThrow({
    where: { email: ROLE_USER_EMAIL.landowner },
  });

  const listing = await prisma.listing.create({
    data: {
      ...fields,
      ownerId: owner.id,
      status: intent === "publish" ? "PUBLISHED" : "DRAFT",
    },
  });

  const uploadedUrls = await uploadListingImages(imageFiles, `listings/${listing.id}`);
  const combinedUrls = [...uploadedUrls, ...images];

  const imageUrls =
    combinedUrls.length > 0
      ? combinedUrls
      : [
          "/listings/pakchong-musi/photo-1.jpg",
          "/listings/pakchong-musi/photo-2.jpg",
          "/listings/pakchong-musi/photo-3.jpg",
        ];

  await prisma.listingImage.createMany({
    data: imageUrls.map((url, order) => ({ listingId: listing.id, url, order })),
  });

  if (fields.saleMode !== "WHOLE") {
    const boundary = await parseBoundaryInput(formData, listing.id);
    await ensureSubdivisionProject(listing.id, fields.wholeLandPrice, plotInputs, boundary);
  }

  revalidatePath("/");
  revalidatePath("/my-listings");

  if (intent === "feasibility") {
    redirect(`/listings/${listing.id}/feasibility`);
  }
  if (intent === "publish") {
    redirect(`/listings/${listing.id}`);
  }
  redirect("/my-listings");
}

export async function updateListing(listingId: string, formData: FormData) {
  const fields = parseListingFields(formData);
  const images = parseImageUrls(formData);
  const imageFiles = parseImageFiles(formData);
  const plotInputs = parsePlotInputs(formData);
  const intent = String(formData.get("intent") ?? "draft");

  const current = await prisma.listing.findUniqueOrThrow({ where: { id: listingId } });

  await prisma.listing.update({
    where: { id: listingId },
    data: {
      ...fields,
      status: intent === "publish" ? "PUBLISHED" : current.status,
    },
  });

  const uploadedUrls = await uploadListingImages(imageFiles, `listings/${listingId}`);
  const combinedUrls = [...uploadedUrls, ...images];

  if (combinedUrls.length > 0) {
    await prisma.listingImage.deleteMany({ where: { listingId } });
    await prisma.listingImage.createMany({
      data: combinedUrls.map((url, order) => ({ listingId, url, order })),
    });
  }

  if (fields.saleMode !== "WHOLE") {
    const boundary = await parseBoundaryInput(formData, listingId);
    await ensureSubdivisionProject(listingId, fields.wholeLandPrice, plotInputs, boundary);
  }

  revalidatePath("/");
  revalidatePath("/my-listings");
  revalidatePath(`/listings/${listingId}`);

  if (intent === "feasibility") {
    redirect(`/listings/${listingId}/feasibility`);
  }
  if (intent === "publish") {
    redirect(`/listings/${listingId}`);
  }
  redirect("/my-listings");
}

export async function publishListing(listingId: string) {
  await prisma.listing.update({
    where: { id: listingId },
    data: { status: "PUBLISHED" },
  });

  revalidatePath("/");
  revalidatePath("/my-listings");
  revalidatePath(`/listings/${listingId}`);
  revalidatePath(`/listings/${listingId}/feasibility`);

  redirect(`/listings/${listingId}`);
}

export async function deleteListing(listingId: string) {
  await prisma.listing.delete({ where: { id: listingId } });

  revalidatePath("/");
  revalidatePath("/my-listings");
  revalidatePath("/admin");
}
