"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

const SERVICE_TYPES = [
  "FEASIBILITY_STUDY",
  "SUBDIVISION_PLANNING",
  "PLOT_PRICING_STRATEGY",
  "PROJECT_LAUNCH_CONSULTATION",
] as const;
type ServiceType = (typeof SERVICE_TYPES)[number];

export async function createServiceRequest(listingId: string, formData: FormData) {
  const rawServiceType = formData.get("serviceType");
  const serviceType = (SERVICE_TYPES.includes(rawServiceType as ServiceType)
    ? rawServiceType
    : SERVICE_TYPES[0]) as ServiceType;
  const notes = String(formData.get("notes") ?? "").trim() || null;

  await prisma.serviceRequest.create({
    data: { listingId, serviceType, notes },
  });

  revalidatePath(`/listings/${listingId}/service-request`);
  revalidatePath("/admin");

  redirect(`/listings/${listingId}/service-request`);
}

const SERVICE_REQUEST_STATUSES = ["REQUESTED", "IN_REVIEW", "COMPLETED"] as const;
type ServiceRequestStatus = (typeof SERVICE_REQUEST_STATUSES)[number];

export async function updateServiceRequestStatus(requestId: string, formData: FormData) {
  const request = await prisma.serviceRequest.findUniqueOrThrow({ where: { id: requestId } });

  const rawStatus = formData.get("status");
  const status = (SERVICE_REQUEST_STATUSES.includes(rawStatus as ServiceRequestStatus)
    ? rawStatus
    : request.status) as ServiceRequestStatus;

  await prisma.serviceRequest.update({ where: { id: requestId }, data: { status } });

  revalidatePath("/admin");
  revalidatePath(`/listings/${request.listingId}/service-request`);
}
