"use client";

import { useState } from "react";
import Link from "next/link";
import { SubdivisionMap, type SubdivisionMapPlot } from "@/components/SubdivisionMap";
import { BookingForm } from "@/components/BookingForm";
import {
  formatCurrency,
  formatNumber,
  PLOT_STATUS_LABELS,
} from "@/lib/format";
import { getRoadsForPlots } from "@/lib/subdivision";
import { createListingBooking } from "@/lib/actions/bookings";

type Tab = "whole" | "subdivision";

export interface PropertyTabsPlot extends SubdivisionMapPlot {
  price: number;
}

export function PropertyTabs({
  listingId,
  saleMode,
  landArea,
  wholeLandPrice,
  ownerName,
  plots,
  boundary,
}: {
  listingId: string;
  saleMode: string;
  landArea: number;
  wholeLandPrice: number;
  ownerName: string;
  plots: PropertyTabsPlot[];
  boundary?: string | null;
}) {
  const showWhole = saleMode === "WHOLE" || saleMode === "BOTH";
  const showSubdivision = saleMode === "SUBDIVISION" || saleMode === "BOTH";
  const [tab, setTab] = useState<Tab>(showWhole ? "whole" : "subdivision");

  const counts = plots.reduce(
    (acc, p) => {
      acc[p.status] = (acc[p.status] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const prices = plots.map((p) => p.price).filter(Boolean);
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 0;

  return (
    <div className="rounded-2xl border border-primary-100 bg-white shadow-sm">
      {showWhole && showSubdivision && (
        <div className="flex border-b border-primary-100">
          <button
            onClick={() => setTab("whole")}
            className={`flex-1 px-4 py-3 text-sm font-semibold transition-colors ${
              tab === "whole"
                ? "border-b-2 border-primary-600 text-primary-700"
                : "text-foreground/50 hover:text-foreground"
            }`}
          >
            ขายยกแปลง
          </button>
          <button
            onClick={() => setTab("subdivision")}
            className={`flex-1 px-4 py-3 text-sm font-semibold transition-colors ${
              tab === "subdivision"
                ? "border-b-2 border-primary-600 text-primary-700"
                : "text-foreground/50 hover:text-foreground"
            }`}
          >
            แบ่งแปลงขาย
          </button>
        </div>
      )}

      <div className="p-5">
        {tab === "whole" && showWhole && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-primary-50 p-4">
                <p className="text-xs text-foreground/60">ขนาดที่ดิน</p>
                <p className="mt-1 text-lg font-bold text-foreground">
                  {formatNumber(landArea)} ไร่
                </p>
              </div>
              <div className="rounded-xl bg-primary-50 p-4">
                <p className="text-xs text-foreground/60">ราคาขายยกแปลง</p>
                <p className="mt-1 text-lg font-bold text-primary-700">
                  {formatCurrency(wholeLandPrice)}
                </p>
              </div>
            </div>
            <div className="rounded-xl border border-primary-100 p-4">
              <p className="mb-3 text-sm text-foreground/70">ติดต่อ: {ownerName}</p>
              <BookingForm
                action={createListingBooking.bind(null, listingId)}
                submitLabel="จองที่ดินแปลงนี้"
                successMessage="ส่งคำขอจองที่ดินเรียบร้อยแล้ว เจ้าของที่ดินและผู้ดูแลระบบจะได้รับการแจ้งเตือน"
              />
            </div>
          </div>
        )}

        {tab === "subdivision" && showSubdivision && (
          <div className="flex flex-col gap-4">
            {plots.length === 0 ? (
              <p className="text-sm text-foreground/60">
                ยังไม่มีการกำหนดแปลงสำหรับโครงการนี้
              </p>
            ) : (
              <>
                <div className="aspect-[5/4] w-full max-w-md">
                  <SubdivisionMap plots={plots} roads={boundary ? [] : getRoadsForPlots(plots.map((p) => p.label))} boundary={boundary} />
                </div>
                <div className="grid grid-cols-3 gap-3 text-center text-sm">
                  <div className="rounded-xl bg-primary-50 p-3">
                    <p className="font-bold text-primary-700">{counts.AVAILABLE ?? 0}</p>
                    <p className="text-xs text-foreground/60">{PLOT_STATUS_LABELS.AVAILABLE}</p>
                  </div>
                  <div className="rounded-xl bg-orange-50 p-3">
                    <p className="font-bold text-orange-700">{counts.RESERVED ?? 0}</p>
                    <p className="text-xs text-foreground/60">{PLOT_STATUS_LABELS.RESERVED}</p>
                  </div>
                  <div className="rounded-xl bg-red-50 p-3">
                    <p className="font-bold text-red-700">{counts.SOLD ?? 0}</p>
                    <p className="text-xs text-foreground/60">{PLOT_STATUS_LABELS.SOLD}</p>
                  </div>
                </div>
                <p className="text-sm text-foreground/70">
                  ช่วงราคาแปลง: {formatCurrency(minPrice)} - {formatCurrency(maxPrice)}
                </p>
                <Link
                  href={`/listings/${listingId}/subdivision`}
                  className="rounded-full bg-primary-600 px-5 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-700"
                >
                  เปิดแผนผังแปลงแบบเต็ม
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
