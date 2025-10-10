"use client"
import 'swiper/css'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade } from 'swiper/modules'
import Image from 'next/image'
import FcaPresentation from '@/components/FcaPresentation'

import {
  Users,
  Handshake,
  Volleyball,
  Globe,
  Calendar,
  Trophy,
  HeartHandshake,
  Download,
  Award,
  Target,
  Heart,
  Shield,
  Zap,
  TrendingUp
} from "lucide-react";

const values = [
  {
    label: "Esprit d'équipe",
    Icon: Users,
    color: "from-cyan-500 to-blue-600",
    description: "La force du collectif avant tout"
  },
  {
    label: "Respect mutuel",
    Icon: Handshake,
    color: "from-emerald-500 to-cyan-600",
    description: "L'écoute et la bienveillance au cœur de nos actions"
  },
  {
    label: "Fair-play",
    Icon: Shield,
    color: "from-purple-500 to-indigo-600",
    description: "Jouer avec honneur et intégrité"
  },
  {
    label: "Inclusion",
    Icon: Globe,
    color: "from-pink-500 to-purple-600",
    description: "Ouvert à tous, sans distinction"
  },
  {
    label: "Passion",
    Icon: Heart,
    color: "from-red-500 to-pink-600",
    description: "L'amour du jeu qui nous anime"
  },
];

const stats = [
  { label: "Ans d'existence", value: "15+", Icon: Award, color: "cyan" },
  { label: "Joueurs actifs", value: "30+", Icon: Users, color: "indigo" },
  { label: "Matchs organisés", value: "100+", Icon: Trophy, color: "green" },
  { label: "Derbys mensuels", value: "12/an", Icon: Calendar, color: "purple" },
];

const newsItems = [
  {
    date: "12 mai 2025",
    title: "Victoire 3-1 lors du dernier derby mensuel",
    description:
      "Une performance collective remarquable avec un doublé de 'Ari le Kid' et une défense solide. Bravo à tous les joueurs présents !",
    Icon: Trophy,
  },
  {
    date: "5 mai 2025",
    title: "Entraînement pour le match de gala à venir",
    description:
      "Une belle ambiance, de nouvelles stratégies, et déjà une belle énergie sur le terrain. On est fin prêt !",
    Icon: Zap,
  },
  {
    date: "28 avril 2025",
    title: "Match hommage avec les anciens du club tombés",
    description:
      "Un moment chargé d'émotion et de respect. Les générations se sont croisées autour de notre passion commune.",
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
    <main className="bg-gradient-to-br from-gray-50 via-cyan-50/20 to-indigo-50/20">
      {/* Hero Section Premium */}
      <section className="relative min-h-[85vh] overflow-hidden flex items-center justify-center">
        {/* Background avec effet parallax */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/default.jpeg"
            alt="FCA Background"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/95 via-black/90 to-indigo-950/95" />
        </div>

        {/* Halos lumineux animés */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />

        {/* Contenu */}
        <div className="relative z-10 text-center px-4 sm:px-6 py-20 max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-400/30 rounded-full px-5 py-2 mb-8 backdrop-blur-sm animate-fade-in">
            <Trophy className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-semibold text-cyan-300">Depuis 2010</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-cyan-300 drop-shadow-2xl mb-6 tracking-tight animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Football Club Atrokpocodji
          </h1>

          <p className="text-xl sm:text-2xl md:text-3xl text-cyan-300 font-bold mb-4 drop-shadow-lg animate-fade-in" style={{ animationDelay: '0.2s' }}>
            « Unis par la passion, guidés par la fraternité »
          </p>

          <p className="text-base sm:text-lg text-white/80 max-w-3xl mx-auto mb-10 leading-relaxed animate-fade-in" style={{ animationDelay: '0.3s' }}>
            Plus qu'un club de football, une véritable communauté où règnent convivialité, esprit d'équipe et dépassement de soi. Rejoignez une famille de passionnés !
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <a
              href="/visitors/adhesion"
              className="group relative px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold rounded-xl shadow-2xl hover:shadow-green-500/60 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 w-full sm:w-auto"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                ⚽ Rejoindre le FCA
                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </a>
            <a
              href="#histoire"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border-2 border-white/30 hover:border-cyan-400/60 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
            >
              Découvrir notre histoire
            </a>
          </div>

          {/* Stats rapides */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mt-16 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            {stats.map(({ label, value, Icon, color }) => (
              <div key={label} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300">
                <Icon className={`w-6 h-6 sm:w-8 sm:h-8 text-${color}-400 mx-auto mb-2`} />
                <div className={`text-2xl sm:text-3xl font-black text-${color}-400 mb-1`}>{value}</div>
                <div className="text-xs sm:text-sm text-white/70">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-cyan-400 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Présentation FCA (Component existant) */}
      <section className="py-12">
        <FcaPresentation />
      </section>

      {/* Histoire du Club - Redesignée */}
      <section className="relative py-16 sm:py-24" id="histoire">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-br from-white/80 to-cyan-50/80 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-cyan-100 overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center p-8 sm:p-12">
              {/* Image */}
              <div className="relative group order-2 lg:order-1">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-indigo-500/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500" />
                <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl ring-8 ring-cyan-100/50 transform group-hover:scale-105 transition-all duration-500">
                  <Image
                    src="/images/default.jpeg"
                    alt="Logo du Football Club Atrokpocodji"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Contenu */}
              <div className="space-y-6 order-1 lg:order-2">
                <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-2">
                  <Award className="w-4 h-4 text-cyan-600" />
                  <span className="text-sm font-semibold text-cyan-700">Notre Histoire</span>
                </div>

                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-indigo-600">
                  15 ans de passion
                </h2>

                <div className="space-y-4 text-gray-700">
                  <p className="text-lg leading-relaxed">
                    Fondé en <span className="font-bold text-cyan-600">2010</span>, le Football Club Atrokpocodji (FCA) est né de la passion d'un groupe d'amis unis par les mêmes valeurs : <em className="text-cyan-600 font-semibold">amitié, fair-play et amour du football</em>.
                  </p>

                  <p className="text-lg leading-relaxed">
                    De ses débuts modestes à aujourd'hui, le club est devenu une <span className="font-semibold text-indigo-600">véritable référence locale</span> du football amateur, rassemblant chaque semaine des passionnés de tous horizons.
                  </p>

                  <div className="bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 border-l-4 border-cyan-500 rounded-r-xl p-6 my-6">
                    <p className="text-cyan-700 font-bold text-xl italic">
                      « Plus qu'un sport, une famille. »
                    </p>
                  </div>

                  <p className="text-lg leading-relaxed">
                    Animé par ses derbys mensuels, ses entraînements ouverts à tous, et ses engagements auprès de la communauté, le FCA incarne bien plus qu'un club : <span className="font-semibold text-cyan-600">c'est un lieu de partage, de cohésion sociale et de dépassement de soi</span>.
                  </p>
                </div>

                {/* Mini stats */}
                <div className="grid grid-cols-3 gap-4 pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-black text-cyan-600">2010</div>
                    <div className="text-xs text-gray-600 font-medium">Fondation</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-black text-indigo-600">30+</div>
                    <div className="text-xs text-gray-600 font-medium">Membres</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-black text-green-600">100+</div>
                    <div className="text-xs text-gray-600 font-medium">Matchs</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Galerie Photos - Améliorée */}
      <section className="relative py-16 bg-gradient-to-b from-black via-indigo-950/90 to-black">
        <div className="absolute inset-0 bg-[url('/images/default.jpeg')] opacity-5 bg-cover bg-center" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-400/30 rounded-full px-4 py-2 mb-4 backdrop-blur-sm">
              <Trophy className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-semibold text-cyan-300">Galerie</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-white mb-4">
              Moments du Club
            </h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Revivez les temps forts qui font la richesse de notre communauté
            </p>
          </div>

          <Swiper
            modules={[Autoplay]}
            slidesPerView={1}
            spaceBetween={24}
            loop
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="!pb-12"
          >
            {moments.map((src, i) => (
              <SwiperSlide key={i}>
                <div className="group relative aspect-[4/3] rounded-2xl overflow-hidden">
                  <Image
                    fill
                    src={src}
                    alt={`Moment ${i + 1}`}
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <style jsx global>{`
          .swiper-pagination-bullet {
            background: rgba(34,211,238,0.5);
            opacity: 1;
          }
          .swiper-pagination-bullet-active {
            background: #22d3ee;
            transform: scale(1.3);
          }
        `}</style>
      </section>

      {/* Valeurs - Repensée */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-2 mb-4">
              <Heart className="w-4 h-4 text-cyan-600" />
              <span className="text-sm font-semibold text-cyan-700">Nos Valeurs</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-indigo-600 mb-4">
              Ce qui nous guide
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Le FCA est plus qu'un club, c'est une famille unie autour de principes forts
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {values.map(({ label, Icon, color, description }, i) => (
              <div
                key={i}
                className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-gray-100 hover:border-cyan-300"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`} />
                <div className="relative">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${color} text-white mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{label}</h3>
                  <p className="text-sm text-gray-600">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Règlements */}
      <section className="py-16 bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-2 mb-4">
              <Shield className="w-4 h-4 text-cyan-600" />
              <span className="text-sm font-semibold text-cyan-700">Règlements</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-indigo-600">
              Nos engagements
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Règles Derbys */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-cyan-100 hover:border-cyan-300 transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
                  <Trophy className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Règles des Derbys</h3>
              </div>

              <p className="text-gray-700 leading-relaxed mb-6">
                Les derbys du FCA ne sont pas de simples matchs : ce sont des moments attendus avec passion, encadrés par des règles précises pour garantir équilibre, respect et plaisir de jeu.
              </p>

              <ul className="space-y-4 mb-6">
                {[
                  { title: "Équipes tirées au sort", desc: "Un tirage aléatoire est effectué avant chaque session mensuelle" },
                  { title: "Matchs de 2 × 45 minutes", desc: "Deux mi-temps dynamiques pour maximiser le temps de jeu" },
                  { title: "Respect et fair-play", desc: "Les attitudes négatives n'ont pas leur place sur le terrain" }
                ].map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 font-bold text-sm mt-0.5">
                      {i + 1}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{item.title}</div>
                      <div className="text-sm text-gray-600">{item.desc}</div>
                    </div>
                  </li>
                ))}
              </ul>

              <a
                href="/documents/reglement.pdf"
                download
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-cyan-500/50 transition-all duration-300"
              >
                <Download className="w-5 h-5" />
                Télécharger le règlement
              </a>
            </div>

            {/* Règlement Intérieur */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-indigo-100 hover:border-indigo-300 transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Règlement Intérieur</h3>
              </div>

              <p className="text-gray-700 leading-relaxed mb-6">
                Pour garantir une atmosphère conviviale, respectueuse et équitable, chaque membre s'engage à respecter ces règles.
              </p>

              <ol className="space-y-4 mb-6">
                {[
                  "Cotisation annuelle obligatoire",
                  "Présence régulière aux entraînements",
                  "Respect du matériel et des infrastructures",
                  "Communication via les canaux officiels",
                  "Respect des horaires"
                ].map((rule, i) => (
                  <li key={i} className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm mt-0.5">
                      {i + 1}
                    </div>
                    <div className="font-medium text-gray-900">{rule}</div>
                  </li>
                ))}
              </ol>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                <div className="text-amber-600 flex-shrink-0">⚠️</div>
                <p className="text-sm text-amber-800">
                  Le non-respect répété de ces règles peut entraîner une exclusion temporaire ou définitive.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Actualités - Modernisée */}
      <section className="py-16 bg-gradient-to-b from-black via-indigo-950 to-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-400/30 rounded-full px-4 py-2 mb-4 backdrop-blur-sm">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-semibold text-cyan-300">Actualités</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-white">
              Les dernières nouvelles
            </h2>
          </div>

          <div className="space-y-6">
            {newsItems.map(({ date, title, description, Icon }, i) => (
              <article
                key={i}
                className="bg-gradient-to-r from-indigo-950/80 to-indigo-900/60 backdrop-blur-sm rounded-2xl border border-cyan-700/30 hover:border-cyan-500/50 p-6 sm:p-8 transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-500/20"
              >
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                      <Icon className="w-7 h-7" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-cyan-400 text-sm font-semibold mb-2">{date}</div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">{title}</h3>
                    <p className="text-white/70 leading-relaxed">{description}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}