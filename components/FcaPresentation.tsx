import { Users } from 'lucide-react';

export default function FcaPresentation() {
  return (
    <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Effet glassmorphism en arrière-plan */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-cyan-100/40 via-white/70 to-indigo-100/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-cyan-100/50" />

      {/* Header */}
      <div className="text-center mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-2 mb-4">
          <Users className="w-4 h-4 text-cyan-600" />
          <span className="text-sm font-semibold text-cyan-700">Notre Équipe</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-indigo-600">
          Une Fraternité Avant Tout
        </h2>

        <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
          Le FCA n'est pas qu'un simple club de football. C'est une <span className="font-bold text-cyan-600">famille, une confrérie</span>, une fusion de talents, de personnalités et d'histoires.
          Chaque membre y apporte sa touche, sa folie, son sérieux, son talent ou son humour. Ensemble, ils forment un <span className="font-bold text-indigo-600">collectif vivant</span>, à la fois compétitif et fraternel.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Carte */}
        <Card
          icon="⚽"
          title="Les Stratèges & Dirigeants"
          items={[
            "<strong>Principe (DOUVI)</strong>, alias Syndicat – fin négociateur, gardien de l’équité, maître du social.",
            "<strong>Roméo (L'Alchimiste)</strong> – rigoureux, leader naturel, roi du pressing.",
            "<strong>Ulrich (VP)</strong> – dribbleur génial, vice-président en pause.",
            "<strong>Damien (Fo Dami)</strong> – discret et sage, entre tacles et appels professionnels.",
          ]}
        />
        <Card
          icon="🔥"
          title="Les Artistes et Foudres de Guerre"
          items={[
            "<strong>Harold (Haroldinho)</strong> – Messi du club, génie du ballon et roi des piques.",
            "<strong>Arias (Ari le Kid)</strong> – sniper imprévisible, génie offensif.",
            "<strong>Pamelo (Kondo)</strong> – gardien ancestral devenu attaquant.",
            "<strong>Philippe (Le Boucher)</strong> – défenseur-faucheur, gardien rugueux.",
          ]}
        />
        <Card
          icon="🎯"
          title="Les Buteurs et Techniciens"
          items={[
            "<strong>Louis (Assailant)</strong> – renard râleur mais généreux.",
            "<strong>Leonce (Valverde)</strong> – frappe du gauche et ego assumé.",
            "<strong>Purcel & Rodolpho</strong> – duo CODJO, gabarits courts, précision chirurgicale.",
            "<strong>Giorgio</strong> – blessé mais indispensable.",
          ]}
        />
        <Card
          icon="🧠"
          title="Les Milieux Créateurs"
          items={[
            "<strong>Ghislain (Stabilisateur)</strong> – grande gueule et chef d’orchestre du jeu.",
            "<strong>Bismark (Tokoss)</strong> – danseur de rumba au contrôle léché.",
            "<strong>Hazim (H-Tag)</strong> – dribble élégant, tombeur en herbe.",
            "<strong>Mathieu (Zincre)</strong> – humour tranchant et finesse technique.",
          ]}
        />
        <Card
          icon="🛡️"
          title="Les Défenseurs Solides"
          items={[
            "<strong>Fiacre (Ounfo 3)</strong> – dribbleur rusé, roc défensif.",
            "<strong>Robert (Chaussettes rouges)</strong> – buteur défensif au mental de guerrier.",
            "<strong>Ferdinand (Ferdi Baba)</strong> – tout-terrain, du but à la cage.",
          ]}
        />
        <Card
          icon="🧤"
          title="Les Gardiens Inoubliables"
          items={[
            "<strong>Joslin (L’homme de Ouidah)</strong> – gardien de l’honneur du club.",
            "<strong>Laurent (Le Doyen)</strong> – sobre, efficace et respecté.",
            "<strong>Garmeito</strong> – brute canadienne, pressing et arrêt réflexe.",
          ]}
        />
        <Card
          icon="🧪"
          title="Les Apprentis et Jeunes Promesses"
          items={[
            "<strong>Pamphile (L’Élu)</strong> – travailleur acharné, étoile montante.",
            "<strong>Frejus (Juso)</strong> – technique prometteuse mais encore instable.",
          ]}
        />
        <Card
          icon="🌍"
          title="Les Absents Présents"
          items={[
            "<strong>Leonce (Le Ghanéen)</strong> & <strong>Candide (Sénégal Rek)</strong> – lointains mais fidèles.",
            "<strong>Garmelle (Garmeito)</strong> – exilé au Canada, cœur resté FCA.",
          ]}
        />
        <Card
          icon="👔"
          title="Les Personnalités Atypiques"
          items={[
            "<strong>Fidel (Chef Service)</strong> – aura naturelle et passion communicative.",
          ]}
        />
      </div>

      {/* ADN du club */}
      <div className="mt-12 bg-gradient-to-r from-cyan-50 to-indigo-50 rounded-3xl p-8 sm:p-10 shadow-xl border-2 border-cyan-100">
        <div className="flex items-start gap-4 mb-6">
          <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl shadow-lg">
            🧬
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
              L'ADN du Club
            </h3>
            <p className="text-gray-600 text-sm">Ce qui nous rend unique</p>
          </div>
        </div>

        <div className="space-y-4 text-gray-700 text-base sm:text-lg leading-relaxed">
          <p>
            Le FCA, c'est une <span className="font-bold text-indigo-600">communauté multigénérationnelle et multifacette</span>, unie par la passion du ballon rond et la joie d'être ensemble.
          </p>
          <p>
            Loin des grands stades, ce club est une <span className="font-bold text-cyan-600">bulle d'authenticité</span>, où les vannes fusent, les liens se tissent et le jeu reste un plaisir avant tout.
          </p>

          <div className="mt-6 pt-6 border-t border-indigo-200">
            <p className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-indigo-600 text-center">
              Des vannes, du talent, de l'amitié.<br />
              Voilà le vrai trophée du FCA. 🏆
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// Composant Card réutilisable pour chaque section
function Card({
  icon,
  title,
  items,
}: {
  icon: string;
  title: string;
  items: string[];
}) {
  return (
    <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl border-2 border-gray-100 hover:border-cyan-300 transition-all duration-300 overflow-hidden">
      {/* Overlay gradient au hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-indigo-500/0 group-hover:from-cyan-500/5 group-hover:to-indigo-500/5 transition-all duration-300" />

      <div className="relative p-6">
        {/* Header avec icône */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-cyan-600 transition-colors">
            {title}
          </h3>
        </div>

        {/* Liste des joueurs */}
        <ul className="space-y-2.5">
          {items.map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-gray-700 transition-all duration-200 group-hover:translate-x-1"
            >
              <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2" />
              <span
                className="text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: item }}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
