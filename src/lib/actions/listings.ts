"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ROLE_USER_EMAIL } from "@/lib/roles";
import { PLOT_LABELS, PLOT_POINTS, defaultPerspectiveImages } from "@/lib/subdivision";
import { uploadListingImages } from "@/lib/actions/uploads";

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

async function ensureSubdivisionProject(listingId: string, wholeLandPrice: number) {
  const existing = await prisma.subdivisionProject.findUnique({
    where: { listingId },
  });
  if (existing) return existing;

  const project = await prisma.subdivisionProject.create({
    data: {
      listingId,
      roadCost: 0,
      infrastructureCost: 0,
      marketingCost: 0,
    },
  });

  const defaultPlotPrice = Math.round((wholeLandPrice || 8_000_000) / PLOT_LABELS.length);

  for (const label of PLOT_LABELS) {
    await prisma.plot.create({
      data: {
        projectId: project.id,
        label,
        area: 100,
        width: 10,
        depth: 20,
        price: defaultPlotPrice,
        status: "AVAILABLE",
        points: PLOT_POINTS[label],
        perspectiveImages: defaultPerspectiveImages(`${listingId}-${label.toLowerCase()}`),
      },
    });
  }

  return project;
}

export async function createListing(formData: FormData) {
  const fields = parseListingFields(formData);
  const images = parseImageUrls(formData);
  const imageFiles = parseImageFiles(formData);
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
    await ensureSubdivisionProject(listing.id, fields.wholeLandPrice);
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
    await ensureSubdivisionProject(listingId, fields.wholeLandPrice);
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
