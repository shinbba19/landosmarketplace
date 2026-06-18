import Link from "next/link";
import { formatCurrency, formatNumber } from "@/lib/format";
import {
  RECOMMENDATION_LABELS,
  ROAD_AREA_RATIO,
  SQ_WAH_PER_RAI,
  type Recommendation,
} from "@/lib/feasibility";
import { publishListing } from "@/lib/actions/listings";

const RECOMMENDATION_STYLES: Record<Recommendation, string> = {
  CONSIDER_SUBDIVISION: "bg-primary-100 text-primary-700",
  SELL_WHOLE: "bg-zinc-100 text-zinc-700",
  REQUIRES_REVIEW: "bg-orange-100 text-orange-700",
};

export function FeasibilityResult({
  listingId,
  listingStatus,
  analysis,
}: {
  listingId: string;
  listingStatus: string;
  analysis: {
    landArea: number;
    numberOfPlots: number;
    pricePerSqWah: number;
    avgPlotPrice: number;
    infrastructureCost: number;
    marketingCost: number;
    wholeLandRevenue: number;
    subdivisionRevenue: number;
    developmentCost: number;
    netProfit: number;
    roi: number;
    profitDifference: number;
    recommendation: string;
    createdAt: Date;
  };
}) {
  const recommendation = analysis.recommendation as Recommendation;
  const sellableAreaSqWah = analysis.landArea * SQ_WAH_PER_RAI * (1 - ROAD_AREA_RATIO);

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-primary-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">ผลการวิเคราะห์</h2>
        <span className="text-xs text-foreground/50">
          วิเคราะห์เมื่อ {new Date(analysis.createdAt).toLocaleString("th-TH")}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-zinc-50 p-4">
          <p className="text-xs text-foreground/60">พื้นที่ขายได้ (หลังหักถนน 10%)</p>
          <p className="mt-1 text-lg font-bold text-foreground">
            {formatNumber(sellableAreaSqWah)} ตร.ว.
          </p>
        </div>
        <div className="rounded-xl bg-zinc-50 p-4">
          <p className="text-xs text-foreground/60">ราคาเฉลี่ยต่อแปลง</p>
          <p className="mt-1 text-lg font-bold text-foreground">
            {formatCurrency(analysis.avgPlotPrice)}
          </p>
        </div>
        <div className="rounded-xl bg-zinc-50 p-4">
          <p className="text-xs text-foreground/60">จำนวนแปลง</p>
          <p className="mt-1 text-lg font-bold text-foreground">
            {formatNumber(analysis.numberOfPlots)} แปลง
          </p>
        </div>
        <div className="rounded-xl bg-zinc-50 p-4">
          <p className="text-xs text-foreground/60">ขนาดเฉลี่ยต่อแปลง</p>
          <p className="mt-1 text-lg font-bold text-foreground">
            {analysis.numberOfPlots > 0
              ? formatNumber(Math.round(sellableAreaSqWah / analysis.numberOfPlots))
              : "0"}{" "}
            ตร.ว.
          </p>
        </div>
        <div className="rounded-xl bg-zinc-50 p-4">
          <p className="text-xs text-foreground/60">ค่าสาธารณูปโภค (10% ของราคาที่ดิน)</p>
          <p className="mt-1 text-lg font-bold text-foreground">
            {formatCurrency(analysis.infrastructureCost)}
          </p>
        </div>
        <div className="rounded-xl bg-zinc-50 p-4">
          <p className="text-xs text-foreground/60">ค่าใช้จ่ายด้านการตลาด/บริหาร (5% ของราคาที่ดิน)</p>
          <p className="mt-1 text-lg font-bold text-foreground">
            {formatCurrency(analysis.marketingCost)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-primary-50 p-4">
          <p className="text-xs text-foreground/60">รายได้จากการขายยกแปลง</p>
          <p className="mt-1 text-lg font-bold text-foreground">
            {formatCurrency(analysis.wholeLandRevenue)}
          </p>
        </div>
        <div className="rounded-xl bg-primary-50 p-4">
          <p className="text-xs text-foreground/60">รายได้จากการแบ่งแปลงขาย</p>
          <p className="mt-1 text-lg font-bold text-foreground">
            {formatCurrency(analysis.subdivisionRevenue)}
          </p>
        </div>
        <div className="rounded-xl bg-zinc-50 p-4">
          <p className="text-xs text-foreground/60">ต้นทุนพัฒนาโครงการ</p>
          <p className="mt-1 text-lg font-bold text-foreground">
            {formatCurrency(analysis.developmentCost)}
          </p>
        </div>
        <div className="rounded-xl bg-zinc-50 p-4">
          <p className="text-xs text-foreground/60">กำไรสุทธิ (แบ่งแปลงขาย)</p>
          <p className="mt-1 text-lg font-bold text-foreground">
            {formatCurrency(analysis.netProfit)}
          </p>
        </div>
        <div className="rounded-xl bg-zinc-50 p-4">
          <p className="text-xs text-foreground/60">ผลตอบแทนการลงทุน (ROI)</p>
          <p className="mt-1 text-lg font-bold text-foreground">
            {formatNumber(analysis.roi)}%
          </p>
        </div>
        <div className="rounded-xl bg-zinc-50 p-4">
          <p className="text-xs text-foreground/60">ส่วนต่างกำไร</p>
          <p
            className={`mt-1 text-lg font-bold ${
              analysis.profitDifference >= 0 ? "text-primary-700" : "text-red-600"
            }`}
          >
            {analysis.profitDifference >= 0 ? "+" : ""}
            {formatCurrency(analysis.profitDifference)}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2 rounded-xl border border-primary-100 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs text-foreground/60">คำแนะนำ</p>
          <span
            className={`mt-1 inline-block rounded-full px-3 py-1 text-sm font-semibold ${RECOMMENDATION_STYLES[recommendation]}`}
          >
            {RECOMMENDATION_LABELS[recommendation]}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href="https://landosv1.onrender.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-zinc-300 bg-white px-5 py-2 text-center text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
          >
            วิเคราห์ความเป็นไปได้แบบละเอียด
          </a>
          <Link
            href={`/listings/${listingId}/service-request`}
            className="rounded-full border border-primary-300 bg-primary-50 px-5 py-2 text-center text-sm font-semibold text-primary-700 hover:bg-primary-100"
          >
            ขอคำปรึกษาผู้เชี่ยวชาญ
          </Link>
          {listingStatus !== "PUBLISHED" && (
            <form action={publishListing.bind(null, listingId)}>
              <button
                type="submit"
                className="rounded-full bg-primary-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-700"
              >
                เผยแพร่ประกาศ
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
