import React from "react";
import Image from "next/image";

export default function FootballLoader() {
  return (
    <div className="flex items-center justify-center min-h-[300px]">
      <div className="relative flex flex-col items-center space-y-4">
        {/* Ballon de foot */}
        <div className="w-16 h-16 animate-bounce-soccer">
          <Image
            src="/images/logo-fca.jpeg"
            alt="Ballon de foot"
            width={64}
            height={64}
            className="w-full h-full object-contain rounded-full"
          />
        </div>

        {/* Texte */}
        <p className="text-center text-gray-600 font-semibold animate-pulse">
          Chargement en cours...
        </p>
      </div>
    </div>
  );
}
