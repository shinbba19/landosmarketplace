"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRole } from "@/lib/role-context";
import { RoleSwitcher } from "./RoleSwitcher";

export function Header() {
  const { role } = useRole();
  const pathname = usePathname();

  const links: { href: string; label: string }[] = [
    { href: "/", label: "ตลาดที่ดิน" },
  ];

  if (role === "landowner") {
    links.push({ href: "/my-listings", label: "ประกาศของฉัน" });
    links.push({ href: "/listings/new", label: "ลงประกาศใหม่" });
  }

  if (role === "admin") {
    links.push({ href: "/admin", label: "แดชบอร์ดผู้ดูแลระบบ" });
  }

  return (
    <header className="sticky top-0 z-30 border-b border-primary-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-primary-700">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white">
            L
          </span>
          LAND OS
        </Link>

        <nav className="flex flex-1 items-center gap-1 overflow-x-auto sm:gap-2">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary-600 text-white"
                    : "text-foreground/70 hover:bg-primary-50 hover:text-primary-700"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <RoleSwitcher />
      </div>
    </header>
  );
}
