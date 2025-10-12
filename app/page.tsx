export default function Home() {
  return (
    <div className="relative min-h-[calc(100vh-4.5rem)] bg-gradient-to-br from-gray-900 via-indigo-900 to-black overflow-hidden">
      {/* Background animé optimisé */}
      <div
        className="absolute inset-0 z-0 bg-[url('/images/default.jpeg')] opacity-10 bg-cover bg-center bg-no-repeat animate-subtle-zoom"
        aria-hidden="true"
      />

      {/* Overlay gradient pour meilleure lisibilité */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" aria-hidden="true" />

      {/* Halos lumineux décoratifs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse-slow" aria-hidden="true" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} aria-hidden="true" />

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-4.5rem)] px-4 sm:px-6 py-12">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 max-w-3xl w-full text-center text-white transition-all duration-300 hover:bg-white/15 hover:shadow-cyan-500/20">
          {/* Badge animé */}
          <div className="inline-flex items-center gap-2 bg-cyan-500/20 backdrop-blur-sm border border-cyan-400/30 rounded-full px-4 py-2 mb-6 animate-fade-in">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
            <span className="text-sm font-semibold text-cyan-200">🏆 Saison 2025 en cours</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-indigo-300 to-cyan-300 drop-shadow-[0_0_20px_rgba(6,182,212,0.5)] animate-fade-in">
            Football Club Atrokpocodji
          </h1>

          <p className="mt-4 sm:mt-6 text-lg sm:text-xl md:text-2xl font-bold text-cyan-300 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Bienvenue sur votre plateforme digitale
          </p>

          <p className="mt-6 sm:mt-8 text-base sm:text-lg md:text-xl leading-relaxed text-gray-200 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>

            Découvrez les résultats des derbys, suivez vos statistiques personnelles, consultez le calendrier des matchs et vivez l&apos;expérience FCA comme jamais auparavant.
          </p>

          <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center items-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <a
              href="visitors/adhesion"
              className="group relative w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold rounded-xl shadow-xl hover:shadow-green-500/60 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                ⚽ Rejoindre le FCA
                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </a>

            <a
              href="visitors/tirages"
              className="group relative w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-xl hover:shadow-cyan-500/60 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Voir les tirages
                <svg className="w-5 h-5 transform group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </a>

            <a
              href="visitors/matchs"
              className="group relative w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 border-2 border-white/30 hover:border-cyan-400/60 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Calendrier des matchs
                <svg className="w-5 h-5 transform group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </a>
          </div>

          {/* Stats preview */}
          <div className="mt-12 pt-8 border-t border-white/20 grid grid-cols-3 gap-4 sm:gap-6 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-cyan-400">15+</div>
              <div className="text-xs sm:text-sm text-gray-400 mt-1">Ans d&apos;existence</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-indigo-400">30+</div>
              <div className="text-xs sm:text-sm text-gray-400 mt-1">Joueurs actifs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-400">100+</div>
              <div className="text-xs sm:text-sm text-gray-400 mt-1">Matchs organisés</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
