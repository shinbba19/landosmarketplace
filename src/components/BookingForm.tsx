"use client";

import { useRef, useState } from "react";
import { createBooking } from "@/lib/actions/bookings";

export function BookingForm({ plotId, plotLabel }: { plotId: string; plotLabel: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [submitted, setSubmitted] = useState(false);

  async function handleAction(formData: FormData) {
    await createBooking(plotId, formData);
    setSubmitted(true);
    formRef.current?.reset();
  }

  if (submitted) {
    return (
      <div className="rounded-xl bg-primary-50 p-4 text-sm text-primary-700">
        ส่งคำขอจองแปลง {plotLabel} เรียบร้อยแล้ว เจ้าของที่ดินและผู้ดูแลระบบจะได้รับการแจ้งเตือน
      </div>
    );
  }

  return (
    <form ref={formRef} action={handleAction} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-foreground/60">ชื่อ-นามสกุล</label>
        <input
          name="name"
          required
          className="rounded-lg border border-primary-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-foreground/60">เบอร์โทรศัพท์</label>
        <input
          name="phone"
          required
          className="rounded-lg border border-primary-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-foreground/60">อีเมล</label>
        <input
          type="email"
          name="email"
          required
          className="rounded-lg border border-primary-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-foreground/60">ข้อความ (ถ้ามี)</label>
        <textarea
          name="message"
          rows={2}
          className="rounded-lg border border-primary-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
        />
      </div>
      <button
        type="submit"
        className="rounded-full bg-primary-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-700"
      >
        จองแปลง {plotLabel}
      </button>
    </form>
  );
}
