"use client";

const SALE_MODE_OPTIONS = [
  { value: "WHOLE", label: "ขายยกแปลงเท่านั้น" },
  { value: "SUBDIVISION", label: "แบ่งแปลงขายเท่านั้น" },
  { value: "BOTH", label: "ขายยกแปลงหรือแบ่งแปลงขาย" },
];

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

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-foreground/70">ขนาดที่ดิน (ไร่)</label>
          <input
            type="number"
            step="0.01"
            name="landArea"
            required
            defaultValue={initialValues?.landArea}
            className="rounded-lg border border-primary-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
          />
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
            defaultValue={initialValues?.saleMode ?? "WHOLE"}
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
