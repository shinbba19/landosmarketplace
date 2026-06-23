"use client";

import { useState } from "react";
import { BoundaryEditor } from "@/components/BoundaryEditor";

const SALE_MODE_OPTIONS = [
  { value: "WHOLE", label: "ขายยกแปลงเท่านั้น" },
  { value: "SUBDIVISION", label: "แบ่งแปลงขายเท่านั้น" },
  { value: "BOTH", label: "ขายยกแปลงหรือแบ่งแปลงขาย" },
];

export interface PlotInput {
  label: string;
  area: number;
  price: number;
}

export interface ListingFormValues {
  title?: string;
  province?: string;
  district?: string;
  subdistrict?: string;
  landArea?: number;
  lat?: number;
  lng?: number;
  wholeLandPrice?: number;
  description?: string;
  saleMode?: string;
  images?: string[];
  plots?: PlotInput[];
  boundaryPoints?: string;
  surveyImageUrl?: string;
}

function splitLandArea(totalRai: number) {
  const rai = Math.floor(totalRai);
  const remainNgan = (totalRai - rai) * 4;
  const ngan = Math.floor(remainNgan);
  const wah = Math.round((remainNgan - ngan) * 100 * 100) / 100;
  return { rai, ngan, wah };
}

export function ListingForm({
  action,
  initialValues,
  submitLabels = {},
}: {
  action: (formData: FormData) => void;
  initialValues?: ListingFormValues;
  submitLabels?: { draft?: string; feasibility?: string; publish?: string };
}) {
  const initial = splitLandArea(initialValues?.landArea ?? 0);
  const [rai, setRai] = useState(String(initial.rai));
  const [ngan, setNgan] = useState(String(initial.ngan));
  const [wah, setWah] = useState(String(initial.wah));
  const landArea = (Number(rai) || 0) + (Number(ngan) || 0) / 4 + (Number(wah) || 0) / 400;

  const [surveyPreview, setSurveyPreview] = useState<string | null>(
    initialValues?.surveyImageUrl ?? null,
  );
  const [saleMode, setSaleMode] = useState(initialValues?.saleMode ?? "WHOLE");
  const defaultPlots = initialValues?.plots ?? [
    { label: "P1", area: 100, price: 0 },
    { label: "P2", area: 100, price: 0 },
    { label: "P3", area: 100, price: 0 },
    { label: "P4", area: 100, price: 0 },
  ];
  const [plots, setPlots] = useState<PlotInput[]>(defaultPlots);
  const showSubdivision = saleMode === "SUBDIVISION" || saleMode === "BOTH";

  return (
    <form action={action} className="flex flex-col gap-6">
      <section className="grid grid-cols-1 gap-4 rounded-2xl border border-primary-100 bg-white p-5 shadow-sm sm:grid-cols-2">
        <div className="sm:col-span-2 flex flex-col gap-1">
          <label className="text-sm font-medium text-foreground/70">ชื่อประกาศ</label>
          <input
            name="title"
            required
            defaultValue={initialValues?.title}
            placeholder="เช่น ที่ดินวิวภูเขา ใกล้ถนนวงแหวน"
            className="rounded-lg border border-primary-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-foreground/70">จังหวัด</label>
          <input
            name="province"
            required
            defaultValue={initialValues?.province}
            className="rounded-lg border border-primary-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-foreground/70">อำเภอ / เขต</label>
          <input
            name="district"
            required
            defaultValue={initialValues?.district}
            className="rounded-lg border border-primary-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-foreground/70">ตำบล / แขวง</label>
          <input
            name="subdistrict"
            required
            defaultValue={initialValues?.subdistrict}
            className="rounded-lg border border-primary-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
          />
        </div>

        <div className="sm:col-span-2 flex flex-col gap-1">
          <label className="text-sm font-medium text-foreground/70">ขนาดที่ดิน</label>
          <input type="hidden" name="landArea" value={landArea} />
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              step="1"
              value={rai}
              onChange={(e) => setRai(e.target.value)}
              className="w-24 rounded-lg border border-primary-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
            <span className="text-sm text-foreground/60">ไร่</span>
            <input
              type="number"
              min="0"
              max="3"
              step="1"
              value={ngan}
              onChange={(e) => setNgan(e.target.value)}
              className="w-20 rounded-lg border border-primary-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
            <span className="text-sm text-foreground/60">งาน</span>
            <input
              type="number"
              min="0"
              max="99"
              step="0.01"
              value={wah}
              onChange={(e) => setWah(e.target.value)}
              className="w-24 rounded-lg border border-primary-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
            <span className="text-sm text-foreground/60">ตร.ว.</span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-foreground/70">ละติจูด (Latitude)</label>
          <input
            type="number"
            step="0.000001"
            name="lat"
            required
            defaultValue={initialValues?.lat}
            className="rounded-lg border border-primary-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-foreground/70">ลองจิจูด (Longitude)</label>
          <input
            type="number"
            step="0.000001"
            name="lng"
            required
            defaultValue={initialValues?.lng}
            className="rounded-lg border border-primary-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-foreground/70">ราคาขายยกแปลง (บาท)</label>
          <input
            type="number"
            step="1"
            name="wholeLandPrice"
            required
            defaultValue={initialValues?.wholeLandPrice}
            className="rounded-lg border border-primary-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-foreground/70">รูปแบบการขาย</label>
          <select
            name="saleMode"
            value={saleMode}
            onChange={(e) => setSaleMode(e.target.value)}
            className="rounded-lg border border-primary-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
          >
            {SALE_MODE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2 flex flex-col gap-1">
          <label className="text-sm font-medium text-foreground/70">รายละเอียด</label>
          <textarea
            name="description"
            required
            rows={4}
            defaultValue={initialValues?.description}
            className="rounded-lg border border-primary-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
          />
        </div>

        <div className="sm:col-span-2 flex flex-col gap-1">
          <label className="text-sm font-medium text-foreground/70">
            อัปโหลดรูปภาพ (เลือกได้หลายไฟล์)
          </label>
          <input
            type="file"
            name="imageFiles"
            multiple
            accept="image/*"
            className="rounded-lg border border-primary-200 px-3 py-2 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-primary-100 file:px-3 file:py-1 file:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-400"
          />
        </div>

        <div className="sm:col-span-2 flex flex-col gap-1">
          <label className="text-sm font-medium text-foreground/70">
            หรือลิงก์ URL รูปภาพ (หนึ่งรายการต่อบรรทัด)
          </label>
          <textarea
            name="images"
            rows={3}
            defaultValue={initialValues?.images?.join("\n")}
            placeholder="เว้นว่างเพื่อใช้รูปภาพตัวอย่างอัตโนมัติ"
            className="rounded-lg border border-primary-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
          />
        </div>
      </section>

      {showSubdivision && (
        <section className="flex flex-col gap-4 rounded-2xl border border-primary-100 bg-white p-5 shadow-sm">
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
            initialBoundary={initialValues?.boundaryPoints}
          />
        </section>
      )}

      {showSubdivision && (
        <section className="flex flex-col gap-4 rounded-2xl border border-primary-100 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-foreground">ข้อมูลแปลงย่อย</h2>

          <input type="hidden" name="plotCount" value={plots.length} />
          <div className="flex flex-col gap-3">
            {plots.map((plot, i) => (
              <div key={i} className="rounded-xl border border-primary-100 bg-zinc-50 p-4">
                <div className="flex flex-wrap items-end gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-foreground/50">แปลง</label>
                    <input
                      name={`plot_label_${i}`}
                      value={plot.label}
                      onChange={(e) => {
                        const next = [...plots];
                        next[i] = { ...next[i], label: e.target.value };
                        setPlots(next);
                      }}
                      className="w-20 rounded-lg border border-primary-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-foreground/50">เนื้อที่ (ตร.ว.)</label>
                    <input
                      type="number"
                      step="0.01"
                      name={`plot_area_${i}`}
                      value={plot.area}
                      onChange={(e) => {
                        const next = [...plots];
                        next[i] = { ...next[i], area: Number(e.target.value) };
                        setPlots(next);
                      }}
                      className="w-28 rounded-lg border border-primary-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-foreground/50">ราคา (บาท)</label>
                    <input
                      type="number"
                      step="1"
                      name={`plot_price_${i}`}
                      value={plot.price}
                      onChange={(e) => {
                        const next = [...plots];
                        next[i] = { ...next[i], price: Number(e.target.value) };
                        setPlots(next);
                      }}
                      className="w-32 rounded-lg border border-primary-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                    />
                  </div>
                  {plots.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setPlots(plots.filter((_, j) => j !== i))}
                      className="ml-auto text-sm font-medium text-red-600 hover:underline"
                    >
                      ลบ
                    </button>
                  )}
                </div>
                <div className="mt-3 flex flex-col gap-1">
                  <label className="text-xs text-foreground/50">รูปภาพแปลง (เลือกได้หลายไฟล์)</label>
                  <input
                    type="file"
                    name={`plot_images_${i}`}
                    multiple
                    accept="image/*"
                    className="text-sm file:mr-3 file:rounded-full file:border-0 file:bg-primary-100 file:px-3 file:py-1 file:text-xs file:text-primary-700"
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() =>
              setPlots([
                ...plots,
                { label: `P${plots.length + 1}`, area: 100, price: 0 },
              ])
            }
            className="self-start rounded-full border border-primary-300 px-4 py-1.5 text-sm font-medium text-primary-700 hover:bg-primary-50"
          >
            + เพิ่มแปลง
          </button>
        </section>
      )}

      <div className="flex flex-wrap justify-end gap-3">
        <button
          type="submit"
          name="intent"
          value="draft"
          className="rounded-full border border-primary-200 px-5 py-2 text-sm font-medium text-foreground/70 hover:bg-primary-50"
        >
          {submitLabels.draft ?? "บันทึกฉบับร่าง"}
        </button>
        <button
          type="submit"
          name="intent"
          value="feasibility"
          className="rounded-full border border-primary-300 bg-primary-50 px-5 py-2 text-sm font-semibold text-primary-700 hover:bg-primary-100"
        >
          {submitLabels.feasibility ?? "วิเคราะห์ความเป็นไปได้"}
        </button>
        <button
          type="submit"
          name="intent"
          value="publish"
          className="rounded-full bg-primary-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-700"
        >
          {submitLabels.publish ?? "เผยแพร่ประกาศ"}
        </button>
      </div>
    </form>
  );
}
