import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import "./globals.css";
import { RoleProvider } from "@/lib/role-context";
import { Header } from "@/components/Header";

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-thai",
  subsets: ["thai", "latin"],
});

export const metadata: Metadata = {
  title: "LAND OS - ตลาดที่ดินและระบบวิเคราะห์ความเป็นไปได้",
  description:
    "แพลตฟอร์มตลาดที่ดิน วิเคราะห์ความเป็นไปได้ และระบบแบ่งแปลงขาย",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${notoSansThai.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <RoleProvider>
          <Header />
          <main className="flex-1">{children}</main>
        </RoleProvider>
      </body>
    </html>
  );
}
