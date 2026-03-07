"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const photos = [
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

// Pattern bento : certaines images sont grandes (span 2 cols ou 2 rows)
function getBentoClass(index: number) {
  const pattern = index % 8;
  if (pattern === 0) return "col-span-2 row-span-2"; // grande
  if (pattern === 3) return "col-span-2";             // large
  if (pattern === 5) return "row-span-2";             // haute
  return "";                                           // normale
}

export default function PhotoGallery() {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const goNext = useCallback(() => {
    setLightbox((prev) => (prev !== null ? (prev + 1) % photos.length : null));
  }, []);

  const goPrev = useCallback(() => {
    setLightbox((prev) =>
      prev !== null ? (prev - 1 + photos.length) % photos.length : null
    );
  }, []);

  const close = useCallback(() => setLightbox(null), []);

  // Keyboard navigation
  useEffect(() => {
    if (lightbox === null) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    }
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [lightbox, close, goNext, goPrev]);

  return (
    <>
      {/* Bento Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 auto-rows-[140px] sm:auto-rows-[180px] md:auto-rows-[200px] gap-2 sm:gap-3">
        {photos.map((src, i) => (
          <div
            key={i}
            className={`relative rounded-lg sm:rounded-xl overflow-hidden cursor-pointer group ${getBentoClass(i)}`}
            onClick={() => setLightbox(i)}
          >
            <Image
              src={src}
              alt={`FCA moment ${i + 1}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
          onClick={close}
        >
          {/* Close */}
          <button
            onClick={close}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Counter */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 text-white/60 text-sm font-medium">
            {lightbox + 1} / {photos.length}
          </div>

          {/* Prev */}
          <button
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            className="absolute left-2 sm:left-6 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            aria-label="Photo précédente"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Image */}
          <div
            className="relative w-[90vw] h-[70vh] sm:w-[80vw] sm:h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={photos[lightbox]}
              alt={`FCA moment ${lightbox + 1}`}
              fill
              className="object-contain"
              sizes="90vw"
              priority
            />
          </div>

          {/* Next */}
          <button
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            className="absolute right-2 sm:right-6 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            aria-label="Photo suivante"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      )}
    </>
  );
}
