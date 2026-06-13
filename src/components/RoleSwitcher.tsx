"use client";

import { ROLE_LABELS, useRole, type Role } from "@/lib/role-context";

const ROLES: Role[] = ["buyer", "landowner", "admin"];

export function RoleSwitcher() {
  const { role, setRole } = useRole();

  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="hidden text-foreground/60 sm:inline">มุมมอง:</span>
      <select
        value={role}
        onChange={(e) => setRole(e.target.value as Role)}
        className="rounded-full border border-primary-200 bg-white px-3 py-1.5 text-sm font-medium text-primary-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
      >
        {ROLES.map((r) => (
          <option key={r} value={r}>
            {ROLE_LABELS[r]}
          </option>
        ))}
      </select>
    </label>
  );
}
