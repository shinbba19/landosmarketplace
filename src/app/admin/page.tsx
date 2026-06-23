import { prisma } from "@/lib/prisma";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export default async function AdminPage() {
  const [listings, plots, bookings, serviceRequests, users] = await Promise.all([
    prisma.listing.findMany({
      include: { owner: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.plot.findMany({
      include: { project: { include: { listing: true } } },
      orderBy: [{ project: { listingId: "asc" } }, { label: "asc" }],
    }),
    prisma.booking.findMany({
      include: { plot: { include: { project: { include: { listing: true } } } }, listing: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.serviceRequest.findMany({
      include: { listing: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.findMany({ orderBy: { createdAt: "asc" } }),
  ]);

  const metrics = {
    totalListings: listings.length,
    publishedListings: listings.filter((l) => l.status === "PUBLISHED").length,
    totalPlots: plots.length,
    availablePlots: plots.filter((p) => p.status === "AVAILABLE").length,
    reservedPlots: plots.filter((p) => p.status === "RESERVED").length,
    soldPlots: plots.filter((p) => p.status === "SOLD").length,
    pendingBookings: bookings.filter((b) => b.status === "PENDING" || b.status === "INTERESTED" || b.status === "VIEWING").length,
    openServiceRequests: serviceRequests.filter((r) => r.status !== "COMPLETED").length,
    totalUsers: users.length,
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">แดชบอร์ดผู้ดูแลระบบ</h1>
        <p className="mt-1 text-foreground/60">
          ภาพรวมและการจัดการประกาศ แปลงที่ดิน การจอง และคำขอคำปรึกษาทั้งหมดในระบบ
        </p>
      </div>

      <AdminDashboard
        metrics={metrics}
        listings={listings.map((l) => ({
          id: l.id,
          title: l.title,
          province: l.province,
          district: l.district,
          saleMode: l.saleMode,
          status: l.status,
          ownerName: l.owner.name,
        }))}
        plots={plots.map((p) => ({
          id: p.id,
          label: p.label,
          listingId: p.project.listingId,
          listingTitle: p.project.listing.title,
          area: p.area,
          price: p.price,
          status: p.status,
        }))}
        bookings={bookings.map((b) => ({
          id: b.id,
          plotLabel: b.plot?.label ?? null,
          listingId: b.plot?.project.listingId ?? b.listingId ?? "",
          listingTitle: b.plot?.project.listing.title ?? b.listing?.title ?? "",
          name: b.name,
          phone: b.phone,
          email: b.email,
          message: b.message,
          status: b.status,
          createdAt: b.createdAt.toISOString(),
        }))}
        serviceRequests={serviceRequests.map((r) => ({
          id: r.id,
          listingId: r.listingId,
          listingTitle: r.listing.title,
          serviceType: r.serviceType,
          status: r.status,
          notes: r.notes,
          createdAt: r.createdAt.toISOString(),
        }))}
        users={users.map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
        }))}
      />
    </div>
  );
}
