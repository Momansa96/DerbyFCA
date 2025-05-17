"use client"
import 'swiper/css'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'

const moments = [
  '/gallery/gal1.jpg',
  '/gallery/gal2.jpg',
  '/gallery/gal3.jpg',
  '/gallery/gal4.jpg',
  '/gallery/gal5.jpg',

]

export default function ClubPage() {
  return (
    <main className="space-y-20">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-black to-indigo-950 text-white py-20 px-6 text-center">
        <h1 className="text-5xl font-extrabold text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)] mb-4">FCA – Le Club</h1>
        <p className="text-xl text-white/80 max-w-3xl mx-auto">
          « Unis par la passion, guidés par le fair-play. »
        </p>
        <div className="mt-6">
          <a href="#engagement" className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 rounded-xl font-semibold transition">Découvrir notre engagement</a>
        </div>
      </section>

      {/* Slider Section */}
      <section className="py-16 bg-black/80">
        <h2 className="text-center text-3xl font-bold text-cyan-300 mb-10">📸 Moments du Club</h2>
        <Swiper
          modules={[Autoplay]}
          slidesPerView={1}
          spaceBetween={20}
          loop
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          className="max-w-5xl mx-auto"
          breakpoints={{
            640: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
        >
          {moments.map((src, i) => (
            <SwiperSlide key={i}>
              <img
                src={src}
                alt={`Moment ${i + 1}`}
                className="w-full h-64 md:h-80 object-cover rounded-xl shadow-lg transition-transform duration-300 hover:scale-105"
                loading="lazy"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Histoire du Club */}
      <section className="bg-indigo-950 px-8 py-16 max-w-6xl mx-auto rounded-xl shadow-lg text-white">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-12">

          {/* Partie image / logo */}
          <div className="flex-shrink-0 w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden shadow-2xl border-4 border-cyan-400">
            {/* Remplace src par le chemin vers ton logo ou image illustrative */}
            <img
              src="/images/default.jpeg"
              alt="Logo du Football Club Amical"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          {/* Partie texte */}
          <div className="max-w-xl space-y-6">
            <h2 className="text-cyan-400 text-4xl font-extrabold drop-shadow-lg flex items-center gap-3">
              <span className="text-5xl">🏟️</span> Notre Histoire
            </h2>

            <p className="text-lg leading-relaxed">
              Fondé en 2010, le <span className="font-semibold text-cyan-300">Football Club Amical (FCA)</span> est né de la passion d’un groupe d’amis partageant les mêmes valeurs : <em>amitié</em>, <em>fair-play</em> et <em>amour du football</em>. Depuis ses débuts modestes, le club est devenu une véritable référence locale du football amateur, rassemblant chaque semaine des passionnés de tous horizons.
            </p>

            <p className="text-lg leading-relaxed">
              Animé par ses derbies mensuels, ses entraînements ouverts à tous, et ses engagements forts auprès de la communauté, le FCA incarne bien plus qu’un club : c’est un lieu de partage, de cohésion sociale et de dépassement de soi.
              <span className="text-cyan-300 font-semibold">Plus qu’un sport, une famille.</span>
            </p>

            <blockquote className="border-l-4 border-cyan-400 pl-6 italic text-cyan-300 text-lg">
              « Le football est le langage universel qui nous unit, au-delà des différences, sur le terrain comme dans la vie. »
            </blockquote>
          </div>
        </div>
      </section>


      {/* Engagements */}
      <section id="engagement" className="py-16 px-6 bg-gradient-to-br from-indigo-900 to-indigo-950 text-white">
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div className="bg-indigo-800/50 p-6 md:p-8 rounded-xl border border-cyan-600 shadow-lg space-y-4">
            <h3 className="text-cyan-300 text-2xl md:text-3xl font-semibold mb-2 drop-shadow-[0_0_6px_rgba(6,182,212,0.7)]">
              ⚖️ Règles des Derbies
            </h3>

            <p className="text-white/90 leading-relaxed">
              Les derbies du FCA ne sont pas de simples matchs : ce sont des moments attendus avec passion, encadrés par des règles précises pour garantir équilibre, respect et plaisir de jeu.
            </p>

            <ul className="list-disc list-inside space-y-3 marker:text-cyan-400 text-white">
              <li>
                <strong>Équipes tirées au sort chaque mois :</strong> pour garantir l’équité et renouveler les compositions, un tirage aléatoire est effectué avant chaque session mensuelle.
              </li>
              <li>
                <strong>Matchs de 2 x 30 minutes :</strong> deux mi-temps dynamiques pour maximiser le temps de jeu tout en respectant le rythme de chacun.
              </li>
              <li>
                <strong>Rotation obligatoire des gardiens :</strong> chaque joueur doit passer dans les cages, garantissant l’équité et la polyvalence.
              </li>
              <li>
                <strong>Auto-arbitrage :</strong> les décisions sont prises de manière collective, dans un esprit de fair-play et de confiance mutuelle.
              </li>
              <li>
                <strong>Respect et esprit sportif avant tout :</strong> les gestes antisportifs ou les attitudes négatives n’ont pas leur place sur le terrain.
              </li>
            </ul>

            <p className="text-sm text-cyan-300 italic">
              💬 Un doute sur une règle ? Le comité sportif du club reste à disposition pour tout éclaircissement.
            </p>
          </div>

          <div className="bg-indigo-800/50 p-6 md:p-8 rounded-xl border border-cyan-600 shadow-lg space-y-4">
            <h3 className="text-cyan-300 text-2xl md:text-3xl font-semibold mb-2 drop-shadow-[0_0_6px_rgba(6,182,212,0.7)]">
              📋 Règlement Intérieur
            </h3>

            <p className="text-white/90 leading-relaxed">
              Afin de garantir une atmosphère conviviale, respectueuse et équitable au sein du club, chaque membre s'engage à respecter le règlement suivant :
            </p>

            <ol className="list-decimal list-inside space-y-3 marker:text-cyan-400 text-white">
              <li>
                <strong>Cotisation annuelle obligatoire :</strong> elle permet d'assurer les frais de gestion, l'entretien du matériel et l'organisation des événements.
              </li>
              <li>
                <strong>Présence régulière aux entraînements :</strong> chaque joueur est invité à participer activement aux séances pour garantir la cohésion du groupe et la progression collective.
              </li>
              <li>
                <strong>Respect du matériel et des infrastructures :</strong> chacun est responsable de l’usage du matériel et veille à laisser les lieux en bon état.
              </li>
              <li>
                <strong>Communication via les canaux officiels :</strong> les annonces, convocations ou changements d’horaires sont diffusés via le groupe WhatsApp et le tableau d'affichage numérique.
              </li>
              <li>
                <strong>Implication dans la vie du club :</strong> chaque membre est encouragé à participer aux actions bénévoles, événements internes et aux décisions collectives.
              </li>
            </ol>

            <p className="text-sm text-cyan-300 mt-2 italic">
              ⚠️ Le non-respect répété de ces règles peut entraîner une exclusion temporaire ou définitive.
            </p>
          </div>

        </div>
      </section>

      {/* Valeurs */}
      <section className="bg-gradient-to-b from-indigo-900 via-indigo-800 to-indigo-900 py-20 px-6 text-white text-center">
        <h2 className="text-cyan-300 text-4xl font-extrabold mb-12 tracking-wide drop-shadow-[0_0_6px_rgba(6,182,212,0.6)]">
          💎 Nos Valeurs Fondamentales
        </h2>

        <p className="max-w-3xl mx-auto text-white/80 text-base md:text-lg mb-10">
          Le FCA est plus qu’un club, c’est une famille unie autour de principes forts. Voici les piliers qui guident chacun de nos entraînements, de nos matchs et de nos moments partagés.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-sm md:text-base font-semibold">
          {[
            { label: '🤝 Esprit d’équipe', color: 'from-cyan-600 to-indigo-700' },
            { label: '🙏 Respect mutuel', color: 'from-emerald-500 to-indigo-700' },
            { label: '⚽ Fair-play', color: 'from-purple-500 to-indigo-700' },
            { label: '🌍 Inclusion', color: 'from-pink-500 to-indigo-700' },
            { label: '📈 Progression', color: 'from-yellow-400 to-indigo-700' }
          ].map(({ label, color }, i) => (
            <div
              key={i}
              className={`p-5 bg-gradient-to-br ${color} rounded-xl shadow-lg transform hover:scale-105 hover:shadow-cyan-400/50 transition duration-300`}
            >
              {label}
            </div>
          ))}
        </div>
      </section>


      {/* Actualités */}
      <section className="py-20 bg-gradient-to-b from-black via-indigo-900 to-black px-6 text-white">
        <h2 className="text-cyan-300 text-4xl font-extrabold text-center mb-12 tracking-wide drop-shadow-[0_0_6px_rgba(6,182,212,0.6)]">
          📰 Dernières nouvelles du club
        </h2>

        <div className="max-w-4xl mx-auto space-y-6">
          {[
            {
              date: '12 mai 2025',
              title: 'Victoire 3-1 lors du dernier derby mensuel',
              description:
                'Une performance collective remarquable avec un doublé de Youssouf et une défense solide. Bravo à tous les joueurs présents !'
            },
            {
              date: '5 mai 2025',
              title: 'Entraînement découverte pour nouveaux membres',
              description:
                'Une belle ambiance, des visages nouveaux, et déjà une belle énergie sur le terrain. Bienvenue aux nouveaux !'
            },
            {
              date: '28 avril 2025',
              title: 'Match hommage avec les anciens du club',
              description:
                'Un moment chargé d’émotion et de respect. Les générations se sont croisées autour de notre passion commune.'
            }
          ].map((news, i) => (
            <div
              key={i}
              className="bg-indigo-950/60 p-6 rounded-xl border border-cyan-700 shadow hover:shadow-cyan-500/30 transition duration-300"
            >
              <p className="text-cyan-400 text-sm font-semibold mb-1">{news.date}</p>
              <h3 className="text-xl font-bold text-white mb-2">{news.title}</h3>
              <p className="text-white/80 text-sm">{news.description}</p>
            </div>
          ))}
        </div>
      </section>

    </main>
  )
}
