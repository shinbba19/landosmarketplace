import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ServiceRequestForm } from "@/components/ServiceRequestForm";
import { createServiceRequest } from "@/lib/actions/service-requests";
import { SERVICE_TYPE_LABELS, SERVICE_REQUEST_STATUS_LABELS } from "@/lib/format";

const STATUS_STYLES: Record<string, string> = {
  REQUESTED: "bg-zinc-100 text-zinc-700",
  IN_REVIEW: "bg-orange-100 text-orange-700",
  COMPLETED: "bg-primary-100 text-primary-700",
};

export default async function ServiceRequestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      serviceRequests: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!listing) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <Link
          href={listing.status === "PUBLISHED" ? `/listings/${listing.id}` : `/listings/${listing.id}/edit`}
          className="text-sm font-medium text-primary-700 hover:underline"
        >
          ← {listing.status === "PUBLISHED" ? "กลับไปหน้ารายละเอียดที่ดิน" : "กลับไปหน้าแก้ไขข้อมูล"}
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">ขอคำปรึกษาผู้เชี่ยวชาญ</h1>
        <p className="mt-1 text-foreground/60">{listing.title}</p>
        <p className="mt-2 text-sm text-foreground/60">
          ทีมผู้เชี่ยวชาญของ LAND OS พร้อมให้คำปรึกษาด้านการศึกษาความเป็นไปได้ การวางแผนแบ่งแปลง
          การกำหนดราคา และการเปิดตัวโครงการ
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <ServiceRequestForm action={createServiceRequest.bind(null, listing.id)} />

        {listing.serviceRequests.length > 0 && (
          <div className="flex flex-col gap-3 rounded-2xl border border-primary-100 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-foreground">ประวัติคำขอ</h2>
            <ul className="flex flex-col gap-3">
              {listing.serviceRequests.map((req) => (
                <li
                  key={req.id}
                  className="flex flex-col gap-1 rounded-xl border border-primary-50 p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium text-foreground">
                      {SERVICE_TYPE_LABELS[req.serviceType]}
                    </p>
                    {req.notes && <p className="mt-1 text-sm text-foreground/60">{req.notes}</p>}
                    <p className="mt-1 text-xs text-foreground/40">
                      ส่งคำขอเมื่อ {new Date(req.createdAt).toLocaleString("th-TH")}
                    </p>
                  </div>
                  <span
                    className={`inline-block self-start rounded-full px-3 py-1 text-xs font-semibold sm:self-center ${STATUS_STYLES[req.status]}`}
                  >
                    {SERVICE_REQUEST_STATUS_LABELS[req.status]}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
