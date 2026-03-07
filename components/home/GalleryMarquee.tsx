"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const row1Images = [
  "/gallery/gal1.jpg",
  "/gallery/gal2.jpg",
  "/gallery/gal3.jpg",
  "/gallery/gal4.jpg",
  "/gallery/gal5.jpg",
  "/gallery/gal6.jpg",
  "/gallery/gal7.jpg",
  "/gallery/gal8.jpg",
  "/gallery/gal9.jpg",
  "/gallery/gal10.jpg",
];

const row2Images = [
  "/gallery/gal11.jpg",
  "/gallery/gal12.jpg",
  "/gallery/gal13.jpg",
  "/gallery/gal14.jpg",
  "/gallery/gal15.jpg",
  "/gallery/gal16.jpg",
  "/gallery/gal17.jpg",
  "/gallery/gal18.jpg",
  "/gallery/gal19.jpg",
];

// Double les images pour un défilement continu sans coupure
const row1 = [...row1Images, ...row1Images];
const row2 = [...row2Images, ...row2Images];

export default function GalleryMarquee() {
  return (
    <section className="bg-surface py-16 sm:py-20 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-secondary mb-3">
            L&apos;ambiance FCA
          </h2>
          <p className="text-gray-500">
            Plus qu&apos;un club, une famille
          </p>
        </div>
      </div>

      {/* Marquee container */}
      <div className="space-y-3 sm:space-y-4 group/gallery">
        {/* Row 1 — scroll left */}
        <div className="flex gap-3 sm:gap-4 animate-marquee-left group-hover/gallery:[animation-play-state:paused]">
          {row1.map((src, i) => (
            <div
              key={`r1-${i}`}
              className="relative flex-shrink-0 w-40 h-28 sm:w-60 sm:h-40 md:w-72 md:h-48 rounded-lg sm:rounded-xl overflow-hidden group/img transition-transform duration-300 hover:scale-105 hover:z-10"
            >
              <Image
                src={src}
                alt={`Moment FCA ${(i % row1Images.length) + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover/img:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/10 transition-colors duration-300" />
            </div>
          ))}
        </div>

        {/* Row 2 — scroll right */}
        <div className="flex gap-3 sm:gap-4 animate-marquee-right group-hover/gallery:[animation-play-state:paused]">
          {row2.map((src, i) => (
            <div
              key={`r2-${i}`}
              className="relative flex-shrink-0 w-40 h-28 sm:w-60 sm:h-40 md:w-72 md:h-48 rounded-lg sm:rounded-xl overflow-hidden group/img transition-transform duration-300 hover:scale-105 hover:z-10"
            >
              <Image
                src={src}
                alt={`Moment FCA ${(i % row2Images.length) + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover/img:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/10 transition-colors duration-300" />
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-10">
        <Link
          href="/visitors/club"
          className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-semibold transition-colors"
        >
          Voir plus de photos
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
