const SALE_TYPE_OPTIONS = [
  { value: "", label: "ทุกประเภท" },
  { value: "WHOLE", label: "ขายยกแปลง" },
  { value: "SUBDIVISION", label: "แบ่งแปลงขาย" },
  { value: "BOTH", label: "ขายยกแปลง / แบ่งแปลงขาย" },
];

export function ListingFilters({
  provinces,
  defaultValues,
}: {
  provinces: string[];
  defaultValues: {
    province?: string;
    district?: string;
    saleMode?: string;
    minPrice?: string;
    maxPrice?: string;
    minArea?: string;
  };
}) {
  return (
    <form className="grid grid-cols-1 gap-3 rounded-2xl border border-primary-100 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-6">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-foreground/60">จังหวัด</label>
        <select
          name="province"
          defaultValue={defaultValues.province ?? ""}
          className="rounded-lg border border-primary-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
        >
          <option value="">ทุกจังหวัด</option>
          {provinces.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-foreground/60">อำเภอ / เขต</label>
        <input
          type="text"
          name="district"
          defaultValue={defaultValues.district ?? ""}
          placeholder="ระบุอำเภอ"
          className="rounded-lg border border-primary-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-foreground/60">ประเภทการขาย</label>
        <select
          name="saleMode"
          defaultValue={defaultValues.saleMode ?? ""}
          className="rounded-lg border border-primary-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
        >
          {SALE_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-foreground/60">ราคาต่ำสุด (บาท)</label>
        <input
          type="number"
          name="minPrice"
          defaultValue={defaultValues.minPrice ?? ""}
          placeholder="0"
          className="rounded-lg border border-primary-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-foreground/60">ราคาสูงสุด (บาท)</label>
        <input
          type="number"
          name="maxPrice"
          defaultValue={defaultValues.maxPrice ?? ""}
          placeholder="ไม่จำกัด"
          className="rounded-lg border border-primary-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-foreground/60">ขนาดที่ดินขั้นต่ำ (ไร่)</label>
        <input
          type="number"
          name="minArea"
          defaultValue={defaultValues.minArea ?? ""}
          placeholder="0"
          className="rounded-lg border border-primary-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
        />
      </div>

      <div className="col-span-full flex justify-end gap-2">
        <a
          href="/"
          className="rounded-full border border-primary-200 px-4 py-2 text-sm font-medium text-foreground/70 hover:bg-primary-50"
        >
          ล้างตัวกรอง
        </a>
        <button
          type="submit"
          className="rounded-full bg-primary-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-700"
        >
          ค้นหา
        </button>
      </div>
    </form>
  );
}
