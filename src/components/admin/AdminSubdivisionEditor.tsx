"use client";

import { useState } from "react";
import { BoundaryEditor } from "@/components/BoundaryEditor";
import { SubdivisionMap } from "@/components/SubdivisionMap";
import { updatePlot, deletePlot, createPlot, updateBoundary } from "@/lib/actions/plots";
import {
  formatCurrency,
  formatNumber,
  PLOT_STATUS_LABELS,
  PLOT_STATUS_COLORS,
} from "@/lib/format";

interface PlotData {
  id: string;
  label: string;
  points: string;
  area: number;
  price: number;
  status: string;
}

export function AdminSubdivisionEditor({
  listingId,
  projectId,
  boundaryPoints,
  surveyImageUrl,
  plots,
}: {
  listingId: string;
  projectId: string;
  boundaryPoints: string | null;
  surveyImageUrl: string | null;
  plots: PlotData[];
}) {
  const [surveyPreview, setSurveyPreview] = useState<string | null>(surveyImageUrl);

  const boundaryAction = updateBoundary.bind(null, projectId);
  const createAction = createPlot.bind(null, projectId);

  return (
    <div className="flex flex-col gap-6">
      {/* Section A: Boundary */}
      <form
        action={boundaryAction}
        className="flex flex-col gap-4 rounded-2xl border border-primary-100 bg-white p-5 shadow-sm"
      >
        <h2 className="text-lg font-bold text-foreground">ขอบเขตที่ดิน</h2>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-foreground/70">
            อัปโหลดรูปโฉนด / แผนที่สำรวจ
          </label>
          <input
            type="file"
            name="surveyImageFile"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setSurveyPreview(URL.createObjectURL(file));
            }}
            className="text-sm file:mr-3 file:rounded-full file:border-0 file:bg-primary-100 file:px-3 file:py-1 file:text-primary-700"
          />
        </div>

        <BoundaryEditor
          surveyImageUrl={surveyPreview}
          initialBoundary={boundaryPoints}
        />

        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-full bg-primary-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-700"
          >
            บันทึกขอบเขต
          </button>
        </div>
      </form>

      {/* Section B: Map preview */}
      <div className="rounded-2xl border border-primary-100 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-foreground">แผนผังแปลง</h2>
        <div className="aspect-[5/4] w-full max-w-2xl">
          <SubdivisionMap
            plots={plots}
            boundary={boundaryPoints}
            roads={[]}
          />
        </div>
      </div>

      {/* Section C: Plot management */}
      <div className="flex flex-col gap-4 rounded-2xl border border-primary-100 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-foreground">จัดการแปลงย่อย</h2>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead className="border-b border-primary-100 text-xs text-foreground/50">
              <tr>
                <th className="px-4 py-3">แปลง</th>
                <th className="px-4 py-3">เนื้อที่ (ตร.ว.)</th>
                <th className="px-4 py-3">ราคา</th>
                <th className="px-4 py-3">สถานะ</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {plots.map((plot) => (
                <PlotRow key={plot.id} plot={plot} />
              ))}
              {plots.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-foreground/50">
                    ยังไม่มีแปลง
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add new plot */}
        <form
          action={createAction}
          className="flex flex-wrap items-end gap-3 rounded-xl border border-dashed border-primary-200 bg-primary-50/50 p-4"
        >
          <div className="flex flex-col gap-1">
            <label className="text-xs text-foreground/50">แปลง</label>
            <input
              name="label"
              required
              placeholder="P1"
              className="w-20 rounded-lg border border-primary-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-foreground/50">เนื้อที่ (ตร.ว.)</label>
            <input
              name="area"
              type="number"
              step="0.01"
              defaultValue={100}
              className="w-28 rounded-lg border border-primary-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-foreground/50">ราคา (บาท)</label>
            <input
              name="price"
              type="number"
              step="1"
              defaultValue={0}
              className="w-32 rounded-lg border border-primary-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
          </div>
          <button
            type="submit"
            className="rounded-full bg-primary-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-primary-700"
          >
            + เพิ่มแปลง
          </button>
        </form>
      </div>
    </div>
  );
}

function PlotRow({ plot }: { plot: PlotData }) {
  const action = updatePlot.bind(null, plot.id);

  return (
    <tr className="border-b border-primary-50 last:border-0">
      <td className="px-4 py-3 font-medium text-foreground">{plot.label}</td>
      <td className="px-4 py-3 text-foreground/70">{formatNumber(plot.area)}</td>
      <td className="px-4 py-3">
        <form action={action} id={`plot-${plot.id}`} className="flex items-center gap-2">
          <input
            name="price"
            type="number"
            step="1"
            defaultValue={plot.price}
            className="w-28 rounded-lg border border-primary-200 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
          />
          <input type="hidden" name="status" value={plot.status} />
        </form>
      </td>
      <td className="px-4 py-3">
        <select
          defaultValue={plot.status}
          onChange={(e) => {
            const form = document.getElementById(`plot-${plot.id}`) as HTMLFormElement | null;
            const statusInput = form?.querySelector<HTMLInputElement>('input[name="status"]');
            if (statusInput) statusInput.value = e.target.value;
            form?.requestSubmit();
          }}
          className={`rounded-full border-0 px-3 py-1 text-xs font-semibold ${PLOT_STATUS_COLORS[plot.status]?.badge ?? "bg-zinc-100 text-zinc-700"}`}
        >
          {Object.entries(PLOT_STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </td>
      <td className="px-4 py-3 text-right">
        <div className="flex justify-end gap-2">
          <button
            type="submit"
            form={`plot-${plot.id}`}
            className="font-medium text-primary-700 hover:underline"
          >
            บันทึก
          </button>
          <form
            action={deletePlot.bind(null, plot.id)}
            onSubmit={(e) => {
              if (!confirm("ต้องการลบแปลงนี้ใช่ไหม?")) e.preventDefault();
            }}
          >
            <button type="submit" className="font-medium text-red-600 hover:underline">
              ลบ
            </button>
          </form>
        </div>
      </td>
    </tr>
  );
}
