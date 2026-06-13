"use client";

import { useState } from "react";
import Image from "next/image";
import type { PerspectiveImage } from "@/lib/subdivision";

export function PerspectiveGallery({ images }: { images: PerspectiveImage[] }) {
  const [active, setActive] = useState(0);

  if (images.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <div className="relative aspect-[3/2] w-full overflow-hidden rounded-xl bg-primary-50">
        <Image
          src={images[active].url}
          alt={images[active].label}
          fill
          className="object-cover"
          unoptimized
        />
        <span className="absolute bottom-2 left-2 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white">
          {images[active].label}
        </span>
      </div>
      <div className="flex gap-2 overflow-x-auto">
        {images.map((img, i) => (
          <button
            key={img.label}
            onClick={() => setActive(i)}
            className={`relative h-14 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 ${
              i === active ? "border-primary-600" : "border-transparent"
            }`}
          >
            <Image src={img.url} alt={img.label} fill className="object-cover" unoptimized />
          </button>
        ))}
      </div>
    </div>
  );
}
