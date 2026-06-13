"use client";

import dynamic from "next/dynamic";

const MapView = dynamic(() => import("./MapView").then((m) => m.MapView), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse rounded-2xl bg-primary-50" />,
});

export function PropertyMap({
  lat,
  lng,
  label,
}: {
  lat: number;
  lng: number;
  label: string;
}) {
  return <MapView lat={lat} lng={lng} label={label} />;
}
