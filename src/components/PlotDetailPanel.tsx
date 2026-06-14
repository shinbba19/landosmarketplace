import { formatCurrency, formatNumber, PLOT_STATUS_LABELS, PLOT_STATUS_COLORS } from "@/lib/format";
import type { PerspectiveImage } from "@/lib/subdivision";
import { PerspectiveGallery } from "@/components/PerspectiveGallery";
import { BookingForm } from "@/components/BookingForm";
import { createBooking } from "@/lib/actions/bookings";

export interface PlotDetailData {
  id: string;
  label: string;
  points: string;
  status: "AVAILABLE" | "RESERVED" | "SOLD";
  area: number;
  width: number;
  depth: number;
  price: number;
  perspectiveImages: PerspectiveImage[];
}

export function PlotDetailPanel({ plot }: { plot: PlotDetailData | null }) {
  if (!plot) {
    return (
      <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-primary-200 bg-white p-6 text-center text-sm text-foreground/50">
        เลือกแปลงบนแผนผังเพื่อดูรายละเอียด
      </div>
    );
  }

  const colors = PLOT_STATUS_COLORS[plot.status];

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-primary-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">แปลง {plot.label}</h2>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${colors.badge}`}>
          {PLOT_STATUS_LABELS[plot.status]}
        </span>
      </div>

      <dl className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl bg-primary-50 p-3">
          <dt className="text-xs text-foreground/60">เนื้อที่</dt>
          <dd className="mt-1 font-semibold text-foreground">{formatNumber(plot.area)} ตร.วา</dd>
        </div>
        <div className="rounded-xl bg-primary-50 p-3">
          <dt className="text-xs text-foreground/60">ราคา</dt>
          <dd className="mt-1 font-semibold text-foreground">{formatCurrency(plot.price)}</dd>
        </div>
        <div className="rounded-xl bg-zinc-50 p-3">
          <dt className="text-xs text-foreground/60">หน้ากว้าง</dt>
          <dd className="mt-1 font-semibold text-foreground">{formatNumber(plot.width)} ม.</dd>
        </div>
        <div className="rounded-xl bg-zinc-50 p-3">
          <dt className="text-xs text-foreground/60">ความลึก</dt>
          <dd className="mt-1 font-semibold text-foreground">{formatNumber(plot.depth)} ม.</dd>
        </div>
      </dl>

      <PerspectiveGallery images={plot.perspectiveImages} />

      {plot.status === "AVAILABLE" ? (
        <BookingForm
          action={createBooking.bind(null, plot.id)}
          submitLabel={`จองแปลง ${plot.label}`}
          successMessage={`ส่งคำขอจองแปลง ${plot.label} เรียบร้อยแล้ว เจ้าของที่ดินและผู้ดูแลระบบจะได้รับการแจ้งเตือน`}
        />
      ) : (
        <div className="rounded-xl bg-zinc-50 p-4 text-sm text-foreground/60">
          แปลงนี้{plot.status === "RESERVED" ? "ถูกจองแล้ว" : "ขายแล้ว"} ไม่สามารถจองเพิ่มได้
        </div>
      )}

      <a
        href="mailto:somchai@landos.dev"
        className="rounded-full border border-primary-300 bg-primary-50 px-5 py-2 text-center text-sm font-semibold text-primary-700 hover:bg-primary-100"
      >
        ติดต่อผู้ขาย
      </a>
    </div>
  );
}
