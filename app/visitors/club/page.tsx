"use client"
import 'swiper/css'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import Image from 'next/image'
import FcaPresentation from '@/components/FcaPresentation'

import {
  Users,
  Handshake,
  Volleyball,
  Globe,
  Calendar, Trophy, HeartHandshake,
  Download
} from "lucide-react";

const values = [
  { label: "Esprit d’équipe", Icon: Users, color: "from-cyan-400 to-cyan-600" },
  { label: "Respect mutuel", Icon: Handshake, color: "from-emerald-400 to-cyan-600" },
  { label: "Fair-play", Icon: Volleyball, color: "from-purple-400 to-cyan-600" },
  { label: "Inclusion", Icon: Globe, color: "from-pink-400 to-cyan-600" },
];

const newsItems = [
  {
    date: "12 mai 2025",
    title: "Victoire 3-1 lors du dernier derby mensuel",
    description:
      "Une performance collective remarquable avec un doublé de Youssouf et une défense solide. Bravo à tous les joueurs présents !",
    Icon: Trophy,
  },
  {
    date: "5 mai 2025",
    title: "Entraînement découverte pour nouveaux membres",
    description:
      "Une belle ambiance, des visages nouveaux, et déjà une belle énergie sur le terrain. Bienvenue aux nouveaux !",
    Icon: Users,
  },
  {
    date: "28 avril 2025",
    title: "Match hommage avec les anciens du club",
    description:
      "Un moment chargé d’émotion et de respect. Les générations se sont croisées autour de notre passion commune.",
    Icon: HeartHandshake,
  },
];

const moments = [
  '/gallery/gal1.jpg',
  '/gallery/gal2.jpg',
  '/gallery/gal3.jpg',
  '/gallery/gal4.jpg',
  '/gallery/gal5.jpg',

]

export default function ClubPage() {
  return (
    <main className="space-y-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-black to-indigo-950 text-white py-20 px-6 text-center flex flex-col items-center">
        {/* Effet glassmorphism en overlay */}
        <div className="absolute inset-0 pointer-events-none bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl -z-10" />

        {/* Halo lumineux derrière le titre */}
        <div className="absolute left-1/2 top-14 -translate-x-1/2 w-72 h-32 bg-cyan-400/30 blur-3xl rounded-full -z-10" />

        <h1 className="text-4xl sm:text-5xl font-extrabold text-cyan-400 drop-shadow-[0_0_16px_rgba(6,182,212,0.85)] mb-4 tracking-wide">
          Football Club Atrokpocodji
        </h1>
        <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-8 font-medium">
          « Unis par la passion, guidés par la Fraternite. »
        </p>
        <div className="mt-2">
          <a
            href="#histoire"
            className="inline-block px-8 py-3 bg-cyan-500/90 hover:bg-cyan-400/90 text-white font-semibold rounded-2xl shadow-lg hover:shadow-cyan-400/40 transition-all duration-300 ring-2 ring-cyan-300/30 hover:ring-cyan-400/60 focus:outline-none focus:ring-4 focus:ring-cyan-400/60"
            style={{ backdropFilter: "blur(2px)" }}
          >
            Découvrir notre Histoire
          </a>
        </div>
      </section>

      {/* Présentation du Club */}
      <FcaPresentation />
      {/* Slider Section */}
      <section className="relative py-12 bg-gradient-to-br from-black/90 via-indigo-950/90 to-black/80 overflow-hidden">
        {/* Overlay glassmorphism */}
        <div className="absolute inset-0 pointer-events-none bg-white/10 backdrop-blur-md rounded-3xl -z-10" />

        {/* Halo lumineux derrière le titre */}
        <div className="absolute left-1/2 top-8 -translate-x-1/2 w-56 h-20 bg-cyan-400/20 blur-2xl rounded-full -z-10" />

        <h2 className="text-center text-3xl sm:text-4xl font-extrabold text-cyan-300 drop-shadow-[0_0_12px_rgba(34,211,238,0.7)] mb-10 tracking-wide">
          📸 Moments du Club
        </h2>

        <div className="max-w-5xl mx-auto px-2 md:px-0">
          <div className="rounded-3xl bg-white/10 backdrop-blur-lg border border-cyan-200/10 shadow-2xl py-6 px-2 md:px-6 transition-all duration-300">
            <Swiper
              modules={[Autoplay]}
              slidesPerView={1}
              spaceBetween={24}
              loop
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              className="!pb-10"
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              pagination={{
                clickable: true,
                bulletClass: 'swiper-pagination-bullet',
                bulletActiveClass: 'swiper-pagination-bullet-active',
              }}
            >
              {moments.map((src, i) => (
                <SwiperSlide key={i}>
                  <div className="group h-full flex flex-col items-center justify-center">
                    <Image
                      width={640}
                      height={360}
                      src={src}
                      alt={`Moment ${i + 1}`}
                      className="w-full h-64 md:h-80 object-cover rounded-xl shadow-xl border border-cyan-100/30 group-hover:shadow-cyan-400/40 transition-all duration-300 group-hover:scale-105 group-hover:ring-4 group-hover:ring-cyan-400/20"
                      loading="lazy"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        {/* Swiper pagination custom style */}
        <style jsx global>{`
    .swiper-pagination-bullet {
      background: rgba(34,211,238,0.4);
      opacity: 1;
      width: 12px;
      height: 12px;
      margin: 0 4px !important;
      transition: background 0.3s;
    }
    .swiper-pagination-bullet-active {
      background: #22d3ee;
      box-shadow: 0 0 0 4px rgba(34,211,238,0.15);
    }
  `}</style>
      </section>


      {/* Histoire du Club */}
      <section className="relative max-w-6xl mx-auto px-6 py-12" id='histoire'>
        {/* Fond glassmorphism */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-cyan-200/40 via-indigo-100/30 to-indigo-300/30 backdrop-blur-xl rounded-3xl shadow-2xl" />

        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Image/logo */}
          <div className="flex-shrink-0 w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden shadow-lg border-4 border-cyan-300 transition-transform duration-300 hover:scale-105">
            <Image
              width={256}
              height={256}
              src="/images/default.jpeg"
              alt="Logo du Football Club Amical"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          {/* Texte */}
          <div className="max-w-xl space-y-8 text-gray-800">
            <h2 className="text-cyan-700 text-4xl font-extrabold flex items-center gap-3 drop-shadow-md">
              <span className="text-5xl">🏟️</span> Notre Histoire
            </h2>

            <p className="text-lg leading-relaxed">
              Fondé en 2010, le <span className="font-semibold text-cyan-600">Football Club Amical (FCA)</span> est né de la passion d’un groupe d’amis partageant les mêmes valeurs : <em>amitié</em>, <em>fair-play</em> et <em>amour du football</em>. Depuis ses débuts modestes, le club est devenu une véritable référence locale du football amateur, rassemblant chaque semaine des passionnés de tous horizons.
            </p>

            <p className="text-lg leading-relaxed">
              Animé par ses derbies mensuels, ses entraînements ouverts à tous, et ses engagements forts auprès de la communauté, le FCA incarne bien plus qu’un club : c’est un lieu de partage, de cohésion sociale et de dépassement de soi. <span className="text-cyan-600 font-semibold">Plus qu’un sport, une famille.</span>
            </p>

            <blockquote className="border-l-4 border-cyan-600 pl-6 italic text-cyan-700 text-lg drop-shadow-sm">
              « Le football est le langage universel qui nous unit, au-delà des différences, sur le terrain comme dans la vie. »
            </blockquote>
          </div>
        </div>
      </section>



      {/* Engagements */}
      <section
        id="engagement"
        className="py-16 px-6 bg-gradient-to-br from-cyan-100 via-blue-50 to-cyan-200 text-gray-800"
      >
        <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
          <div className="bg-white/60 p-8 rounded-3xl border border-cyan-300 shadow-lg backdrop-blur-md space-y-6">
            <h3 className="text-cyan-600 text-3xl font-semibold drop-shadow-sm">
              ⚖️ Règles des Derbies
            </h3>

            <p className="leading-relaxed text-base">
              Les derbies du FCA ne sont pas de simples matchs : ce sont des moments
              attendus avec passion, encadrés par des règles précises pour garantir
              équilibre, respect et plaisir de jeu.
            </p>

            <ul className="list-disc list-inside space-y-3 marker:text-cyan-400 text-gray-700 text-base">
              <li>
                <strong>Équipes tirées au sort chaque mois :</strong> pour garantir
                l’équité et renouveler les compositions, un tirage aléatoire est
                effectué avant chaque session mensuelle.
              </li>
              <li>
                <strong>Matchs de 2 x 45 minutes :</strong> deux mi-temps dynamiques
                pour maximiser le temps de jeu tout en respectant le rythme de chacun.
              </li>

              <li>
                <strong>Respect et esprit sportif avant tout :</strong> les gestes
                antisportifs ou les attitudes négatives n’ont pas leur place sur le
                terrain.
              </li>
            </ul>

            <p className="text-cyan-500 italic text-sm">
              💬 Un doute sur une règle ? Le comité sportif du club reste à disposition pour tout éclaircissement.
            </p>
            <button className="mt-4 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition duration-300" >
              <a href="/documents/reglement.pdf" download className="flex items-center gap-2">
                Telecharger le règlement
                <Download className="w-4 h-4" />
              </a>
            </button>
          </div>

          <div className="bg-white/60 p-8 rounded-3xl border border-cyan-300 shadow-lg backdrop-blur-md space-y-6">
            <h3 className="text-cyan-600 text-3xl font-semibold drop-shadow-sm">
              📋 Règlement Intérieur
            </h3>

            <p className="leading-relaxed text-base">
              Afin de garantir une atmosphère conviviale, respectueuse et équitable au sein du club, chaque membre s&apos;engage à respecter le règlement suivant :
            </p>

            <ol className="list-decimal list-inside space-y-3 marker:text-cyan-400 text-gray-700 text-base">
              <li>
                <strong>Cotisation annuelle obligatoire :</strong> elle permet
                d&apos;assurer les frais de gestion, l&apos;entretien du matériel et
                l&apos;organisation des événements.
              </li>
              <li>
                <strong>Présence régulière aux entraînements :</strong> chaque joueur
                est invité à participer activement aux séances pour garantir la
                cohésion du groupe et la progression collective.
              </li>
              <li>
                <strong>Respect du matériel et des infrastructures :</strong> chacun
                est responsable de l&apos;usage du matériel et veille à laisser les
                lieux en bon état.
              </li>
              <li>
                <strong>Communication via les canaux officiels :</strong> les annonces,
                convocations ou changements d&apos;horaires sont diffusés via le groupe
                WhatsApp.
              </li>
              <li>
                <strong>Respect des horaires :</strong> la ponctualité est essentielle
                pour le bon déroulement des entraînements et matchs.
              </li>
            </ol>

            <p className="text-cyan-500 italic text-sm mt-2">
              ⚠️ Le non-respect répété de ces règles peut entraîner une exclusion temporaire ou définitive.
            </p>
          </div>
        </div>
      </section>


      {/* Valeurs */}
      <section className="max-w-6xl mx-auto py-20 px-6 bg-gradient-to-b from-cyan-100 via-white to-cyan-50 rounded-3xl shadow-2xl backdrop-blur-md text-gray-800">
        <header className="text-center mb-16">
          <h2 className="text-cyan-600 text-4xl font-extrabold tracking-wide drop-shadow-sm">
            💎 Nos Valeurs Fondamentales
          </h2>
          <p className="max-w-3xl mx-auto text-gray-700 text-lg mt-4 font-medium">
            Le FCA est plus qu’un club, c’est une famille unie autour de principes forts. Voici les piliers qui guident chacun de nos matchs et de nos moments partagés.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {values.map(({ label, Icon, color }, i) => (
            <article
              key={i}
              className={`flex flex-col justify-center items-center p-6 bg-gradient-to-br ${color} rounded-xl shadow-lg text-white text-center select-none transition-transform duration-300 hover:scale-105 hover:shadow-cyan-400/50`}
              role="listitem"
              tabIndex={0}
            >
              <Icon className="text-6xl mb-4" aria-hidden="true" />
              <p className="font-semibold text-lg leading-snug">{label}</p>
            </article>
          ))}
        </div>
      </section>




      {/* Actualités */}
      <section className="py-20 bg-gradient-to-b from-black via-indigo-900 to-black px-6 text-white">
        <h2 className="text-cyan-300 text-4xl font-extrabold text-center mb-12 tracking-wide drop-shadow-[0_0_6px_rgba(6,182,212,0.6)]">
          📰 Dernières nouvelles du club
        </h2>

        <div className="max-w-4xl mx-auto space-y-8">
          {newsItems.map(({ date, title, description, Icon }, i) => (
            <article
              key={i}
              className="bg-indigo-950/70 p-6 rounded-xl border border-cyan-700 shadow hover:shadow-cyan-500/40 transition duration-300 flex flex-col md:flex-row gap-4 items-start"
            >
              <div className="flex-shrink-0 text-cyan-400">
                <Icon size={48} strokeWidth={1.5} aria-hidden="true" />
              </div>
              <div className="flex-1">
                <p className="text-cyan-400 text-sm font-semibold mb-1">{date}</p>
                <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                <p className="text-white/80 text-sm leading-relaxed">{description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

    </main>
  )
}
