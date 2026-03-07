import { Trophy, Users, ArrowRight, Swords, UserCheck, Handshake, Calendar, MapPin, Clock, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import LastDerbyPreview from "@/components/home/LastDerbyPreview";
import GalleryMarquee from "@/components/home/GalleryMarquee";

export default function Home() {
  return (
    <div>
      {/* ─── HERO ─── */}
      <section className="relative bg-secondary overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/gallery/gal6.jpg"
            alt="Les membres du FCA"
            fill
            className="object-cover opacity-75"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-secondary/80 to-secondary" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center">
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-4">
            Football Club{" "}
            <span className="text-primary">Atrokpocodji</span>
          </h1>

          <p className="text-xl sm:text-2xl text-accent font-heading font-semibold mb-4">
            Unis par la passion, guidés par la fraternité
          </p>

          <p className="text-base sm:text-lg text-gray-400 max-w-xl mx-auto mb-10">
            Club de football amateur depuis 2010 à Atrokpocodji. Rejoignez une communauté de passionnés.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link
              href="/visitors/adhesion"
              className="w-full sm:w-auto px-8 py-3.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              Rejoindre le FCA
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="/visitors/club"
              className="w-full sm:w-auto px-8 py-3.5 text-gray-300 hover:text-white font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
            >
              Découvrir le club
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-12 sm:mt-16 pt-8 border-t border-gray-700/50 grid grid-cols-3 gap-4 sm:gap-6 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-2xl sm:text-4xl font-heading font-bold text-accent">15+</div>
              <div className="text-[10px] sm:text-sm text-gray-500 mt-1">Ans d&apos;existence</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-4xl font-heading font-bold text-primary">30+</div>
              <div className="text-[10px] sm:text-sm text-gray-500 mt-1">Joueurs actifs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-4xl font-heading font-bold text-white">100+</div>
              <div className="text-[10px] sm:text-sm text-gray-500 mt-1">Matchs organisés</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── COMMENT ÇA MARCHE ─── */}
      <section className="bg-surface py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-secondary mb-3">
              Bien plus qu&apos;un club de foot
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Le FCA, c&apos;est avant tout une fraternité. Un groupe d&apos;amis qui se retrouvent chaque samedi pour partager leur passion du ballon, dans la bonne humeur, le respect et l&apos;esprit de compétition.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                <Swords className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-heading text-lg font-bold text-secondary mb-2">Nos derbys du samedi</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Chaque mois, deux équipes sont formées par tirage au sort. Pendant 4 samedis, elles s&apos;affrontent dans une série de 4 matchs où l&apos;engagement est total&hellip; mais toujours dans la bonne ambiance.
              </p>
              <p className="text-gray-400 text-xs mt-3 italic">
                Buteurs, passes décisives, cartons : tout est suivi et consigné.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                <UserCheck className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-heading text-lg font-bold text-secondary mb-2">Chaque joueur compte</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Au FCA, chaque membre fait partie de l&apos;histoire du club. Buts marqués, matchs joués, classement des buteurs : les statistiques sont mises à jour régulièrement pour alimenter les débats&hellip; et les petites rivalités amicales.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-accent-dark rounded-lg flex items-center justify-center mb-4">
                <Handshake className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-heading text-lg font-bold text-secondary mb-2">Ouvert à tous</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Pas besoin d&apos;être Messi pour rejoindre le FCA. Ici, tout le monde est le bienvenu. Une cotisation accessible, une ambiance fraternelle, et surtout le plaisir de jouer ensemble.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── DERNIER DERBY (dynamique) ─── */}
      <LastDerbyPreview />

      {/* ─── GALERIE ─── */}
      <GalleryMarquee />

      {/* ─── CITATION ─── */}
      <section className="bg-secondary py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <blockquote className="text-lg sm:text-2xl md:text-3xl font-heading font-bold text-white leading-snug mb-6">
            Depuis 2010, le FCA rassemble des amis autour du football, du respect et de la fraternité.
          </blockquote>
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div className="text-left">
              <div className="text-white font-semibold text-sm">La communauté FCA</div>
              <div className="text-gray-400 text-xs">Depuis 2010</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA FINAL ─── */}
      <section className="bg-surface py-16 sm:py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-secondary mb-4">
            Prêt à rejoindre la famille ?
          </h2>
          <p className="text-gray-500 mb-8 max-w-lg mx-auto">
            Aucun niveau requis. Juste l&apos;envie de jouer, de partager et de vivre des moments inoubliables entre amis.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/visitors/adhesion"
              className="px-8 py-3.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              Faire ma demande d&apos;adhésion
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/visitors/matchs"
              className="px-8 py-3.5 bg-white hover:bg-gray-50 border border-gray-200 text-secondary font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 shadow-sm"
            >
              <Calendar className="w-5 h-5" />
              Voir le calendrier
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-secondary border-t border-gray-800 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-3 gap-8 mb-8">
            {/* Logo + description */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Image
                  src="/images/default.jpeg"
                  alt="Logo FCA"
                  width={36}
                  height={36}
                  className="rounded-full"
                />
                <span className="font-heading font-bold text-white text-lg">FCA</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Football Club Atrokpocodji. Club de football amateur fondé en 2010.
              </p>
            </div>

            {/* Liens rapides */}
            <div>
              <h4 className="font-heading font-bold text-white mb-3 text-sm uppercase tracking-wide">Navigation</h4>
              <ul className="space-y-2">
                {[
                  { name: "Derbys", href: "/visitors/tirages" },
                  { name: "Calendrier", href: "/visitors/matchs" },
                  { name: "L'équipe", href: "/visitors/joueurs" },
                  { name: "Classement", href: "/visitors/classement" },
                ].map(link => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-gray-400 hover:text-white text-sm transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-heading font-bold text-white mb-3 text-sm uppercase tracking-wide">Rejoindre</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/visitors/adhesion" className="text-gray-400 hover:text-white text-sm transition-colors">
                    Demande d&apos;adhésion
                  </Link>
                </li>
                <li>
                  <Link href="/visitors/cotisations" className="text-gray-400 hover:text-white text-sm transition-colors">
                    Cotisations
                  </Link>
                </li>
                <li>
                  <Link href="/visitors/club" className="text-gray-400 hover:text-white text-sm transition-colors">
                    À propos du club
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 text-center">
            <p className="text-gray-500 text-xs">
              &copy; {new Date().getFullYear()} Football Club Atrokpocodji. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
