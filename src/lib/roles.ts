export type Role = "buyer" | "landowner" | "admin";

export const ROLE_LABELS: Record<Role, string> = {
  buyer: "ผู้ซื้อ",
  landowner: "เจ้าของที่ดิน",
  admin: "ผู้ดูแลระบบ",
};

/** Maps each demo role to the seeded user account it acts as. */
export const ROLE_USER_EMAIL: Record<Role, string> = {
  buyer: "buyer@landos.dev",
  landowner: "somchai@landos.dev",
  admin: "admin@landos.dev",
};
