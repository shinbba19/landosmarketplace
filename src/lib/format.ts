export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("th-TH", {
    maximumFractionDigits: 0,
  }).format(amount) + " บาท";
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("th-TH", {
    maximumFractionDigits: 2,
  }).format(value);
}

export const SALE_MODE_LABELS: Record<string, string> = {
  WHOLE: "ขายยกแปลง",
  SUBDIVISION: "แบ่งแปลงขาย",
  BOTH: "ขายยกแปลง / แบ่งแปลงขาย",
};

export const LISTING_STATUS_LABELS: Record<string, string> = {
  DRAFT: "ฉบับร่าง",
  PUBLISHED: "เผยแพร่แล้ว",
};

export const PLOT_STATUS_LABELS: Record<string, string> = {
  AVAILABLE: "ว่าง",
  RESERVED: "จองแล้ว",
  SOLD: "ขายแล้ว",
};

export const PLOT_STATUS_COLORS: Record<string, { fill: string; text: string; badge: string }> = {
  AVAILABLE: {
    fill: "#22c55e",
    text: "text-primary-700",
    badge: "bg-primary-100 text-primary-700",
  },
  RESERVED: {
    fill: "#f97316",
    text: "text-orange-700",
    badge: "bg-orange-100 text-orange-700",
  },
  SOLD: {
    fill: "#ef4444",
    text: "text-red-700",
    badge: "bg-red-100 text-red-700",
  },
};

export const BOOKING_STATUS_LABELS: Record<string, string> = {
  INTERESTED: "🟡 สนใจ",
  VIEWING: "🟠 นัดชม",
  RESERVED: "🟢 จองแล้ว",
  CANCELLED: "🔴 ยกเลิก",
};

export const BOOKING_STATUS_COLORS: Record<string, string> = {
  INTERESTED: "bg-yellow-100 text-yellow-700",
  VIEWING: "bg-orange-100 text-orange-700",
  RESERVED: "bg-primary-100 text-primary-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export const SERVICE_TYPE_LABELS: Record<string, string> = {
  FEASIBILITY_STUDY: "ศึกษาความเป็นไปได้โดยละเอียด",
  SUBDIVISION_PLANNING: "วางแผนแบ่งแปลงที่ดิน",
  PLOT_PRICING_STRATEGY: "กำหนดกลยุทธ์ราคาแปลง",
  PROJECT_LAUNCH_CONSULTATION: "ให้คำปรึกษาการเปิดตัวโครงการ",
};

export const SERVICE_REQUEST_STATUS_LABELS: Record<string, string> = {
  REQUESTED: "ส่งคำขอแล้ว",
  IN_REVIEW: "กำลังตรวจสอบ",
  COMPLETED: "เสร็จสิ้น",
};

export const USER_ROLE_LABELS: Record<string, string> = {
  BUYER: "ผู้ซื้อ",
  LANDOWNER: "เจ้าของที่ดิน",
  ADMIN: "ผู้ดูแลระบบ",
};
