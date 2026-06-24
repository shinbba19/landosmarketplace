"use client";

import { useState } from "react";
import Link from "next/link";
import {
  formatCurrency,
  formatNumber,
  SALE_MODE_LABELS,
  LISTING_STATUS_LABELS,
  PLOT_STATUS_LABELS,
  PLOT_STATUS_COLORS,
  BOOKING_STATUS_LABELS,
  BOOKING_STATUS_COLORS,
  SERVICE_TYPE_LABELS,
  SERVICE_REQUEST_STATUS_LABELS,
  USER_ROLE_LABELS,
} from "@/lib/format";
import { updatePlot, deletePlot } from "@/lib/actions/plots";
import { deleteListing } from "@/lib/actions/listings";
import { setBookingStatus } from "@/lib/actions/bookings";
import { updateServiceRequestStatus } from "@/lib/actions/service-requests";

export interface AdminMetrics {
  totalListings: number;
  publishedListings: number;
  totalPlots: number;
  availablePlots: number;
  reservedPlots: number;
  soldPlots: number;
  pendingBookings: number;
  openServiceRequests: number;
  totalUsers: number;
}

export interface AdminListing {
  id: string;
  title: string;
  province: string;
  district: string;
  saleMode: string;
  status: string;
  ownerName: string;
}

export interface AdminPlot {
  id: string;
  label: string;
  listingId: string;
  listingTitle: string;
  area: number;
  price: number;
  status: string;
}

export interface AdminBooking {
  id: string;
  plotLabel: string | null;
  listingId: string;
  listingTitle: string;
  name: string;
  phone: string;
  email: string;
  message: string | null;
  status: string;
  createdAt: string;
}

export interface AdminServiceRequest {
  id: string;
  listingId: string;
  listingTitle: string;
  serviceType: string;
  status: string;
  notes: string | null;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

type Tab = "overview" | "listings" | "plots" | "bookings" | "service-requests" | "users";

const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "ภาพรวม" },
  { id: "listings", label: "ประกาศ" },
  { id: "plots", label: "แปลงที่ดิน" },
  { id: "bookings", label: "การจอง" },
  { id: "service-requests", label: "คำขอคำปรึกษา" },
  { id: "users", label: "ผู้ใช้งาน" },
];

export function AdminDashboard({
  metrics,
  listings,
  plots,
  bookings,
  serviceRequests,
  users,
}: {
  metrics: AdminMetrics;
  listings: AdminListing[];
  plots: AdminPlot[];
  bookings: AdminBooking[];
  serviceRequests: AdminServiceRequest[];
  users: AdminUser[];
}) {
  const [tab, setTab] = useState<Tab>("overview");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              tab === t.id
                ? "bg-primary-600 text-white"
                : "bg-white text-foreground/60 hover:bg-primary-50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && <OverviewTab metrics={metrics} />}
      {tab === "listings" && <ListingsTab listings={listings} />}
      {tab === "plots" && <PlotsTab plots={plots} />}
      {tab === "bookings" && <BookingsTab bookings={bookings} />}
      {tab === "service-requests" && <ServiceRequestsTab requests={serviceRequests} />}
      {tab === "users" && <UsersTab users={users} />}
    </div>
  );
}

function OverviewTab({ metrics }: { metrics: AdminMetrics }) {
  const cards = [
    { label: "ประกาศทั้งหมด", value: metrics.totalListings },
    { label: "ประกาศที่เผยแพร่", value: metrics.publishedListings },
    { label: "แปลงทั้งหมด", value: metrics.totalPlots },
    { label: "แปลงว่าง", value: metrics.availablePlots },
    { label: "แปลงที่จองแล้ว", value: metrics.reservedPlots },
    { label: "แปลงที่ขายแล้ว", value: metrics.soldPlots },
    { label: "การจองที่รอดำเนินการ", value: metrics.pendingBookings },
    { label: "คำขอคำปรึกษาที่เปิดอยู่", value: metrics.openServiceRequests },
    { label: "ผู้ใช้งานทั้งหมด", value: metrics.totalUsers },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {cards.map((card) => (
        <div key={card.label} className="rounded-2xl border border-primary-100 bg-white p-5 shadow-sm">
          <p className="text-xs text-foreground/60">{card.label}</p>
          <p className="mt-2 text-2xl font-bold text-foreground">{formatNumber(card.value)}</p>
        </div>
      ))}
    </div>
  );
}

function ListingsTab({ listings }: { listings: AdminListing[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-primary-100 bg-white shadow-sm">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-primary-100 text-xs text-foreground/50">
          <tr>
            <th className="px-4 py-3">ชื่อประกาศ</th>
            <th className="px-4 py-3">ที่ตั้ง</th>
            <th className="px-4 py-3">รูปแบบการขาย</th>
            <th className="px-4 py-3">สถานะ</th>
            <th className="px-4 py-3">เจ้าของ</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {listings.map((listing) => (
            <tr key={listing.id} className="border-b border-primary-50 last:border-0">
              <td className="px-4 py-3 font-medium text-foreground">{listing.title}</td>
              <td className="px-4 py-3 text-foreground/70">
                {listing.district}, {listing.province}
              </td>
              <td className="px-4 py-3 text-foreground/70">{SALE_MODE_LABELS[listing.saleMode]}</td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    listing.status === "PUBLISHED"
                      ? "bg-primary-100 text-primary-700"
                      : "bg-zinc-100 text-zinc-700"
                  }`}
                >
                  {LISTING_STATUS_LABELS[listing.status]}
                </span>
              </td>
              <td className="px-4 py-3 text-foreground/70">{listing.ownerName}</td>
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-2">
                  <Link
                    href={`/listings/${listing.id}`}
                    className="font-medium text-primary-700 hover:underline"
                  >
                    ดู
                  </Link>
                  {listing.saleMode !== "WHOLE" && (
                    <Link
                      href={`/admin/listings/${listing.id}/subdivision`}
                      className="font-medium text-primary-700 hover:underline"
                    >
                      จัดการแปลง
                    </Link>
                  )}
                  <form
                    action={deleteListing.bind(null, listing.id)}
                    onSubmit={(e) => {
                      if (!confirm("ต้องการลบประกาศนี้ใช่ไหม?")) e.preventDefault();
                    }}
                  >
                    <button type="submit" className="font-medium text-red-600 hover:underline">
                      ลบ
                    </button>
                  </form>
                </div>
              </td>
            </tr>
          ))}
          {listings.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-6 text-center text-foreground/50">
                ยังไม่มีประกาศ
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function PlotsTab({ plots }: { plots: AdminPlot[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-primary-100 bg-white shadow-sm">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="border-b border-primary-100 text-xs text-foreground/50">
          <tr>
            <th className="px-4 py-3">โครงการ</th>
            <th className="px-4 py-3">แปลง</th>
            <th className="px-4 py-3">เนื้อที่ (ตร.วา)</th>
            <th className="px-4 py-3">ราคา</th>
            <th className="px-4 py-3">สถานะ</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {plots.map((plot) => (
            <PlotRow key={plot.id} plot={plot} />
          ))}
          {plots.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-6 text-center text-foreground/50">
                ยังไม่มีแปลงที่ดิน
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function PlotRow({ plot }: { plot: AdminPlot }) {
  const action = updatePlot.bind(null, plot.id);

  return (
    <tr className="border-b border-primary-50 last:border-0">
      <td className="px-4 py-3 text-foreground/70">
        <Link href={`/listings/${plot.listingId}/subdivision`} className="hover:underline">
          {plot.listingTitle}
        </Link>
      </td>
      <td className="px-4 py-3 font-medium text-foreground">{plot.label}</td>
      <td className="px-4 py-3 text-foreground/70">{formatNumber(plot.area)}</td>
      <td colSpan={1} className="px-4 py-3">
        <form action={action} id={`plot-${plot.id}`} className="flex items-center gap-2">
          <input
            name="price"
            type="number"
            step="1"
            defaultValue={plot.price}
            className="w-28 rounded-lg border border-primary-200 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
          />
          <input type="hidden" name="status" value={plot.status} />
        </form>
      </td>
      <td className="px-4 py-3">
        <select
          defaultValue={plot.status}
          onChange={(e) => {
            const form = document.getElementById(`plot-${plot.id}`) as HTMLFormElement | null;
            const statusInput = form?.querySelector<HTMLInputElement>('input[name="status"]');
            if (statusInput) statusInput.value = e.target.value;
            form?.requestSubmit();
          }}
          className={`rounded-full border-0 px-3 py-1 text-xs font-semibold ${PLOT_STATUS_COLORS[plot.status].badge}`}
        >
          {Object.entries(PLOT_STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </td>
      <td className="px-4 py-3 text-right">
        <div className="flex justify-end gap-2">
          <button
            type="submit"
            form={`plot-${plot.id}`}
            className="font-medium text-primary-700 hover:underline"
          >
            บันทึก
          </button>
          <form
            action={deletePlot.bind(null, plot.id)}
            onSubmit={(e) => {
              if (!confirm("ต้องการลบแปลงนี้ใช่ไหม?")) e.preventDefault();
            }}
          >
            <button type="submit" className="font-medium text-red-600 hover:underline">
              ลบ
            </button>
          </form>
        </div>
      </td>
    </tr>
  );
}

function BookingsTab({ bookings }: { bookings: AdminBooking[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-primary-100 bg-white shadow-sm">
      <table className="w-full min-w-[800px] text-left text-sm">
        <thead className="border-b border-primary-100 text-xs text-foreground/50">
          <tr>
            <th className="px-4 py-3">โครงการ / แปลง</th>
            <th className="px-4 py-3">ผู้จอง</th>
            <th className="px-4 py-3">ติดต่อ</th>
            <th className="px-4 py-3">ข้อความ</th>
            <th className="px-4 py-3">สถานะ</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id} className="border-b border-primary-50 last:border-0">
              <td className="px-4 py-3 text-foreground/70">
                <Link
                  href={
                    booking.plotLabel
                      ? `/listings/${booking.listingId}/subdivision`
                      : `/listings/${booking.listingId}`
                  }
                  className="hover:underline"
                >
                  {booking.listingTitle}
                </Link>
                <span className="ml-1 font-medium text-foreground">
                  ({booking.plotLabel ?? "ทั้งแปลง"})
                </span>
              </td>
              <td className="px-4 py-3 font-medium text-foreground">{booking.name}</td>
              <td className="px-4 py-3 text-foreground/70">
                <p>{booking.phone}</p>
                <p>{booking.email}</p>
              </td>
              <td className="px-4 py-3 text-foreground/70">{booking.message ?? "-"}</td>
              <td className="px-4 py-3">
                <form action={setBookingStatus.bind(null, booking.id)}>
                  <select
                    name="status"
                    defaultValue={booking.status}
                    onChange={(e) => e.target.form?.requestSubmit()}
                    className={`rounded-full border-0 px-3 py-1 text-xs font-semibold ${
                      BOOKING_STATUS_COLORS[booking.status] ?? "bg-zinc-100 text-zinc-700"
                    }`}
                  >
                    {(["PENDING", "INTERESTED", "VIEWING", "RESERVED", "CANCELLED"] as const).map((s) => (
                      <option key={s} value={s}>{BOOKING_STATUS_LABELS[s]}</option>
                    ))}
                  </select>
                </form>
              </td>
            </tr>
          ))}
          {bookings.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-6 text-center text-foreground/50">
                ยังไม่มีการจอง
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function ServiceRequestsTab({ requests }: { requests: AdminServiceRequest[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-primary-100 bg-white shadow-sm">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="border-b border-primary-100 text-xs text-foreground/50">
          <tr>
            <th className="px-4 py-3">ประกาศ</th>
            <th className="px-4 py-3">ประเภทบริการ</th>
            <th className="px-4 py-3">รายละเอียด</th>
            <th className="px-4 py-3">สถานะ</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => {
            const action = updateServiceRequestStatus.bind(null, req.id);
            return (
              <tr key={req.id} className="border-b border-primary-50 last:border-0">
                <td className="px-4 py-3 text-foreground/70">
                  <Link href={`/listings/${req.listingId}`} className="hover:underline">
                    {req.listingTitle}
                  </Link>
                </td>
                <td className="px-4 py-3 font-medium text-foreground">
                  {SERVICE_TYPE_LABELS[req.serviceType]}
                </td>
                <td className="px-4 py-3 text-foreground/70">{req.notes ?? "-"}</td>
                <td className="px-4 py-3">
                  <form action={action}>
                    <select
                      name="status"
                      defaultValue={req.status}
                      onChange={(e) => e.target.form?.requestSubmit()}
                      className="rounded-full border-0 bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700"
                    >
                      {Object.entries(SERVICE_REQUEST_STATUS_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </form>
                </td>
              </tr>
            );
          })}
          {requests.length === 0 && (
            <tr>
              <td colSpan={4} className="px-4 py-6 text-center text-foreground/50">
                ยังไม่มีคำขอคำปรึกษา
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function UsersTab({ users }: { users: AdminUser[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-primary-100 bg-white shadow-sm">
      <table className="w-full min-w-[480px] text-left text-sm">
        <thead className="border-b border-primary-100 text-xs text-foreground/50">
          <tr>
            <th className="px-4 py-3">ชื่อ</th>
            <th className="px-4 py-3">อีเมล</th>
            <th className="px-4 py-3">บทบาท</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-primary-50 last:border-0">
              <td className="px-4 py-3 font-medium text-foreground">{user.name}</td>
              <td className="px-4 py-3 text-foreground/70">{user.email}</td>
              <td className="px-4 py-3 text-foreground/70">{USER_ROLE_LABELS[user.role]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
