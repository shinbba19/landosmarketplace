"use client";

export interface FeasibilityFormDefaults {
  landArea: number;
  wholeLandPrice: number;
  numberOfPlots: number;
  pricePerSqWah: number;
}

const fields: { name: keyof FeasibilityFormDefaults; label: string; step?: string }[] = [
  { name: "landArea", label: "ขนาดที่ดิน (ไร่)", step: "0.01" },
  { name: "wholeLandPrice", label: "ราคาซื้อที่ดิน (บาท)" },
  { name: "numberOfPlots", label: "จำนวนแปลงที่ต้องการแบ่ง" },
  { name: "pricePerSqWah", label: "ราคาขายแปลงย่อย (บาท/ตร.ว.)" },
];

export function FeasibilityForm({
  action,
  defaults,
}: {
  action: (formData: FormData) => void;
  defaults: FeasibilityFormDefaults;
}) {
  return (
    <form action={action} className="flex flex-col gap-4 rounded-2xl border border-primary-100 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold text-foreground">ข้อมูลสำหรับวิเคราะห์</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.name} className="flex flex-col gap-1">
            <label className="text-sm font-medium text-foreground/70">{field.label}</label>
            <input
              type="number"
              step={field.step ?? "1"}
              name={field.name}
              required
              defaultValue={defaults[field.name]}
              className="rounded-lg border border-primary-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="rounded-full bg-primary-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-700"
        >
          วิเคราะห์ความเป็นไปได้
        </button>
      </div>
    </form>
  );
}
