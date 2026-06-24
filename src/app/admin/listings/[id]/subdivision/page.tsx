import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminSubdivisionEditor } from "@/components/admin/AdminSubdivisionEditor";
import { PLOT_LABELS, PLOT_POINTS, defaultPerspectiveImages } from "@/lib/subdivision";

async function ensureProject(listingId: string) {
  const existing = await prisma.subdivisionProject.findUnique({
    where: { listingId },
  });
  if (existing) return existing;

  return prisma.subdivisionProject.create({
    data: {
      listingId,
      roadCost: 0,
      infrastructureCost: 0,
      marketingCost: 0,
    },
  });
}

export default async function AdminSubdivisionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const listing = await prisma.listing.findUnique({
    where: { id },
  });

  if (!listing) notFound();

  const project = await ensureProject(listing.id);

  const plots = await prisma.plot.findMany({
    where: { projectId: project.id },
    orderBy: { label: "asc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <Link
          href="/admin"
          className="text-sm font-medium text-primary-700 hover:underline"
        >
          ← กลับไปหน้าผู้ดูแลระบบ
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">
          จัดการแปลงที่ดิน
        </h1>
        <p className="mt-1 text-foreground/60">{listing.title}</p>
      </div>

      <AdminSubdivisionEditor
        listingId={listing.id}
        projectId={project.id}
        boundaryPoints={project.boundaryPoints}
        surveyImageUrl={project.surveyImageUrl}
        plots={plots.map((p) => ({
          id: p.id,
          label: p.label,
          points: p.points,
          area: p.area,
          price: p.price,
          status: p.status,
        }))}
      />
    </div>
  );
}
