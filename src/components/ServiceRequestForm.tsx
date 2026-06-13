"use client";

import { SERVICE_TYPE_LABELS } from "@/lib/format";

export function ServiceRequestForm({
  action,
}: {
  action: (formData: FormData) => void | Promise<void>;
}) {
  return (
    <form action={action} className="flex flex-col gap-4 rounded-2xl border border-primary-100 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-foreground/60">ประเภทบริการ</label>
        <select
          name="serviceType"
          required
          className="rounded-lg border border-primary-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
        >
          {Object.entries(SERVICE_TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-foreground/60">รายละเอียดเพิ่มเติม (ถ้ามี)</label>
        <textarea
          name="notes"
          rows={4}
          placeholder="อธิบายความต้องการของคุณเพิ่มเติม..."
          className="rounded-lg border border-primary-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
        />
      </div>

      <button
        type="submit"
        className="self-start rounded-full bg-primary-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-700"
      >
        ส่งคำขอ
      </button>
    </form>
  );
}
