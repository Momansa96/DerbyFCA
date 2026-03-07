"use client"
import Image from 'next/image'
import FcaPresentation from '@/components/FcaPresentation'
import PhotoGallery from '@/components/club/PhotoGallery'

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
  TrendingUp,
  AlertTriangle
} from "lucide-react";

const values = [
  {
    label: "Esprit d'équipe",
    Icon: Users,
    description: "La force du collectif avant tout"
  },
  {
    label: "Respect mutuel",
    Icon: Handshake,
    description: "L'écoute et la bienveillance au coeur de nos actions"
  },
  {
    label: "Fair-play",
    Icon: Shield,
    description: "Jouer avec honneur et intégrité"
  },
  {
    label: "Inclusion",
    Icon: Globe,
    description: "Ouvert à tous, sans distinction"
  },
  {
    label: "Passion",
    Icon: Heart,
    description: "L'amour du jeu qui nous anime"
  },
];

const stats = [
  { label: "Ans d'existence", value: "15+" },
  { label: "Joueurs actifs", value: "30+" },
  { label: "Matchs organisés", value: "100+" },
  { label: "Derbys mensuels", value: "12/an" },
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


export default function ClubPage() {
  return (
    <main className="bg-surface">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] overflow-hidden flex items-center justify-center bg-secondary">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/gallery/gal6.jpg"
            alt="Les membres du FCA en maillot"
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-secondary/80" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 py-20 max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary/15 border border-primary/30 rounded-full px-5 py-2 mb-8">
            <Trophy className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary-light">Depuis 2010</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-white mb-6 tracking-tight">
            Football Club Atrokpocodji
          </h1>

          <p className="text-xl sm:text-2xl md:text-3xl text-gray-300 font-bold mb-4">
            &laquo; Unis par la passion, guidés par la fraternité &raquo;
          </p>

          <p className="text-base sm:text-lg text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            Plus qu&apos;un club de football, une véritable communauté où règnent convivialité, esprit d&apos;équipe et dépassement de soi. Rejoignez une famille de passionnés !
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/visitors/adhesion"
              className="px-8 py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-lg transition-colors duration-200 w-full sm:w-auto"
            >
              <span className="flex items-center justify-center gap-2">
                Rejoindre le FCA
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </a>
            <a
              href="#histoire"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-gray-600 text-white font-semibold rounded-xl transition-colors duration-200 w-full sm:w-auto"
            >
              Découvrir notre histoire
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mt-16">
            {stats.map(({ label, value }) => (
              <div key={label} className="bg-white/10 border border-white/10 rounded-xl p-4">
                <div className="text-2xl sm:text-3xl font-black text-white mb-1">{value}</div>
                <div className="text-xs sm:text-sm text-white/70">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Présentation FCA */}
      <section className="py-12 bg-surface">
        <FcaPresentation />
      </section>

      {/* Histoire du Club */}
      <section className="relative py-16 sm:py-24 bg-surface" id="histoire">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center p-8 sm:p-12">
              {/* Image */}
              <div className="relative order-2 lg:order-1">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md ring-4 ring-gray-200">
                  <Image
                    src="/gallery/gal6.jpg"
                    alt="Photo de groupe du Football Club Atrokpocodji"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="space-y-6 order-1 lg:order-2">
                <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2">
                  <Award className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-primary">Notre Histoire</span>
                </div>

                <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-secondary">
                  15 ans de passion
                </h2>

                <div className="space-y-4 text-gray-700">
                  <p className="text-lg leading-relaxed">
                    Fondé en <span className="font-semibold text-primary">2010</span>, le Football Club Atrokpocodji (FCA) est né de la passion d&apos;un groupe d&apos;amis unis par les mêmes valeurs : <em className="text-primary font-semibold">amitié, fair-play et amour du football</em>.
                  </p>

                  <p className="text-lg leading-relaxed">
                    De ses débuts modestes à aujourd&apos;hui, le club est devenu une <span className="font-semibold text-primary">véritable référence locale</span> du football amateur, rassemblant chaque semaine des passionnés de tous horizons.
                  </p>

                  <div className="bg-primary/5 border-l-4 border-primary rounded-r-xl p-6 my-6">
                    <p className="text-primary-dark font-bold text-xl italic">
                      &laquo; Plus qu&apos;un sport, une famille. &raquo;
                    </p>
                  </div>

                  <p className="text-lg leading-relaxed">
                    Animé par ses derbys mensuels, ses entraînements ouverts à tous, et ses engagements auprès de la communauté, le FCA incarne bien plus qu&apos;un club : <span className="font-semibold text-primary">c&apos;est un lieu de partage, de cohésion sociale et de dépassement de soi</span>.
                  </p>
                </div>

                {/* Mini stats */}
                <div className="grid grid-cols-3 gap-4 pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-black text-primary">2010</div>
                    <div className="text-xs text-gray-600 font-medium">Fondation</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-black text-primary">30+</div>
                    <div className="text-xs text-gray-600 font-medium">Membres</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-black text-primary">100+</div>
                    <div className="text-xs text-gray-600 font-medium">Matchs</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Galerie Photos */}
      <section className="relative py-16 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-primary/15 border border-primary/30 rounded-full px-4 py-2 mb-4">
              <Trophy className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary-light">Galerie</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-white mb-4">
              Moments du Club
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Cliquez sur une photo pour l&apos;agrandir
            </p>
          </div>

          <PhotoGallery />
        </div>
      </section>

      {/* Valeurs */}
      <section className="py-16 sm:py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-4">
              <Heart className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Nos Valeurs</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-secondary mb-4">
              Ce qui nous guide
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Le FCA est plus qu&apos;un club, c&apos;est une famille unie autour de principes forts
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {values.map(({ label, Icon, description }, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:border-primary/40 transition-colors duration-200"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary text-white mb-4">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{label}</h3>
                <p className="text-sm text-gray-600">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Règlements */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-4">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Règlements</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-secondary">
              Nos engagements
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Règles Derbys */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white">
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
                  { title: "Matchs de 2 x 45 minutes", desc: "Deux mi-temps dynamiques pour maximiser le temps de jeu" },
                  { title: "Respect et fair-play", desc: "Les attitudes négatives n'ont pas leur place sur le terrain" }
                ].map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm mt-0.5">
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
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-colors duration-200"
              >
                <Download className="w-5 h-5" />
                Télécharger le règlement
              </a>
            </div>

            {/* Règlement Intérieur */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-white">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Règlement Intérieur</h3>
              </div>

              <p className="text-gray-700 leading-relaxed mb-6">
                Pour garantir une atmosphère conviviale, respectueuse et équitable, chaque membre s&apos;engage à respecter ces règles.
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
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm mt-0.5">
                      {i + 1}
                    </div>
                    <div className="font-medium text-gray-900">{rule}</div>
                  </li>
                ))}
              </ol>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800">
                  Le non-respect répété de ces règles peut entraîner une exclusion temporaire ou définitive.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Actualités */}
      <section className="py-16 bg-surface-alt">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-4">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Actualités</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-secondary">
              Les dernières nouvelles
            </h2>
          </div>

          <div className="space-y-6">
            {newsItems.map(({ date, title, description, Icon }, i) => (
              <article
                key={i}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8"
              >
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center text-white">
                      <Icon className="w-7 h-7" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-primary text-sm font-semibold mb-2">{date}</div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">{title}</h3>
                    <p className="text-gray-600 leading-relaxed">{description}</p>
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
