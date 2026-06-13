"use client";

import { useState } from "react";
import Image from "next/image";

export function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return <div className="aspect-[16/10] w-full rounded-2xl bg-primary-50" />;
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-primary-50">
        <Image
          src={images[active]}
          alt={alt}
          fill
          className="object-cover"
          unoptimized
          priority
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((src, i) => (
            <button
              key={src}
              onClick={() => setActive(i)}
              className={`relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg border-2 ${
                i === active ? "border-primary-600" : "border-transparent"
              }`}
            >
              <Image src={src} alt={`${alt} ${i + 1}`} fill className="object-cover" unoptimized />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
