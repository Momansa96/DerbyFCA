export default function Home() {
  return (
    <div className="relative min-h-[calc(100vh-4.5rem)] bg-gradient-to-br from-gray-900 via-indigo-900 to-black overflow-hidden">
      {/* Fond animé avec étoiles */}
      <div
        className="absolute inset-0 z-0 animate-pulse bg-[url('/stars.svg')] opacity-20 bg-cover bg-center"
        aria-hidden="true"
      />

      {/* Contenu principal */}
      <div className="relative z-10 flex items-center justify-center h-full px-6 mt-10">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-xl p-10 max-w-xl text-center text-white">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-wide text-indigo-400 drop-shadow-[0_0_10px_rgba(99,102,241,0.7)] animate-pulse">
            FCA Derby Manager
          </h1>
          <p className="mt-6 text-base md:text-lg leading-relaxed text-gray-300">
            Gérez les tirages, consultez les stats de vos coéquipiers et restez à jour sur les matchs à venir.
            <br />
            La nouvelle ère du football communautaire commence ici.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-6 justify-center">
            <a
              href="/tirages"
              className="btn btn-accent w-full sm:w-auto shadow-lg hover:shadow-cyan-500/80 transition-shadow duration-300"
            >
              Voir les tirages
            </a>
            <a
              href="/matchs"
              className="btn btn-outline w-full sm:w-auto border-gray-300 text-white hover:bg-indigo-700 hover:border-indigo-500 transition-colors duration-300"
            >
              Calendrier des matchs
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
