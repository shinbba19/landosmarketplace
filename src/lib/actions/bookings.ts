"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

function bookingFields(formData: FormData) {
  return {
    name: String(formData.get("name") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    message: String(formData.get("message") ?? "").trim() || null,
    status: "PENDING" as const,
  };
}

export async function createBooking(plotId: string, formData: FormData) {
  const plot = await prisma.plot.findUniqueOrThrow({
    where: { id: plotId },
    include: { project: true },
  });

  await prisma.booking.create({
    data: { plotId, ...bookingFields(formData) },
  });

  if (plot.status === "AVAILABLE") {
    await prisma.plot.update({ where: { id: plotId }, data: { status: "RESERVED" } });
  }

  revalidatePath(`/listings/${plot.project.listingId}/subdivision`);
  revalidatePath(`/listings/${plot.project.listingId}`);
  revalidatePath("/admin");
}

export async function createListingBooking(listingId: string, formData: FormData) {
  await prisma.booking.create({
    data: { listingId, ...bookingFields(formData) },
  });

  revalidatePath(`/listings/${listingId}`);
  revalidatePath("/admin");
}

export async function setBookingStatus(bookingId: string, status: "APPROVED" | "REJECTED") {
  const booking = await prisma.booking.findUniqueOrThrow({
    where: { id: bookingId },
    include: { plot: { include: { project: true } } },
  });

  await prisma.booking.update({ where: { id: bookingId }, data: { status } });

  if (booking.plotId && booking.plot) {
    await prisma.plot.update({
      where: { id: booking.plotId },
      data: { status: status === "APPROVED" ? "SOLD" : "AVAILABLE" },
    });
    revalidatePath(`/listings/${booking.plot.project.listingId}/subdivision`);
    revalidatePath(`/listings/${booking.plot.project.listingId}`);
  } else if (booking.listingId) {
    revalidatePath(`/listings/${booking.listingId}`);
  }

  revalidatePath("/admin");
}
