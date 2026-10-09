"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface GalleryImage {
  url: string;
  publicId: string;
}

export function PropertyGallery({
  images,
  title,
}: {
  images: GalleryImage[];
  title: string;
}) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="relative aspect-[16/10] overflow-hidden border border-ink/15">
        <div className="facade h-full w-full" />
      </div>
    );
  }

  const current = images[Math.min(active, images.length - 1)];

  return (
    <div className="space-y-3">
      <div className="relative aspect-[16/10] overflow-hidden border border-ink/15 bg-surface">
        <Image
          src={current.url}
          alt={title}
          fill
          priority
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-cover"
        />
        <span className="figure absolute left-3 top-3 bg-ink px-2 py-1 text-[0.625rem] text-paper">
          PLATE {String(active + 1).padStart(2, "0")} /{" "}
          {String(images.length).padStart(2, "0")}
        </span>
      </div>

      {images.length > 1 && (
        <ul className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {images.map((image, i) => (
            <li key={image.publicId || image.url}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`View image ${i + 1}`}
                aria-current={i === active}
                className={cn(
                  "relative aspect-[4/3] w-full overflow-hidden border transition-colors",
                  i === active
                    ? "border-tolet"
                    : "border-ink/15 hover:border-ink/40",
                )}
              >
                <Image
                  src={image.url}
                  alt=""
                  fill
                  sizes="20vw"
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
