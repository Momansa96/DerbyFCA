export default function FcaPresentation() {
  return (
    <section className="relative max-w-5xl mx-auto p-2 sm:px-6 lg:px-8">
      {/* Effet glassmorphism en arrière-plan */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-cyan-200/60 via-white/80 to-indigo-100/60 backdrop-blur-xl rounded-3xl shadow-2xl" />
      
      <h2 className="text-2xl sm:text-4xl font-extrabold mb-8 text-cyan-700 flex items-center gap-2 drop-shadow-lg">
        <span role="img" aria-label="bouclier">🛡️</span>
        Une Fraternité Avant Tout, un Club à Part
      </h2>
      <p className="mb-8 text-lg sm:text-xl text-gray-700 font-medium">
        Le FCA n’est pas qu’un simple club de football. C’est une famille, une confrérie, une fusion de talents, de personnalités et d’histoires.
        Chaque membre y apporte sa touche, sa folie, son sérieux, son talent ou son humour. Ensemble, ils forment un collectif vivant, à la fois compétitif et fraternel.
      </p>

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
      <div className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-cyan-50/70 to-indigo-50/70 shadow-md border border-cyan-100">
        <h3 className="text-xl sm:text-2xl font-bold mb-2 flex items-center gap-2 text-indigo-700">
          🧬 L’ADN du Club
        </h3>
        <p className="text-gray-700 text-base sm:text-lg">
          Le FCA, c’est une communauté multigénérationnelle et multifacette, unie par la passion du ballon rond et la joie d’être ensemble.
          Loin des grands stades, ce club est une bulle d’authenticité, où les vannes fusent, les liens se tissent et le jeu reste un plaisir avant tout.
          <br /><br />
          <span className="font-bold text-cyan-700">Des vannes, du talent, de l’amitié. Voilà le vrai trophée du FCA.</span>
        </p>
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
    <div className="group relative p-6 rounded-2xl bg-white/60 backdrop-blur-md shadow-lg border border-cyan-100 hover:scale-[1.03] hover:shadow-2xl transition-all duration-300">
      <h3 className="text-lg sm:text-xl font-semibold mb-2 flex items-center gap-2 text-cyan-700">
        <span className="text-2xl">{icon}</span>
        {title}
      </h3>
      <ul className="list-disc list-inside text-gray-700 space-y-1">
        {items.map((item, i) => (
          <li
            key={i}
            className="transition-all duration-200 group-hover:translate-x-1"
            dangerouslySetInnerHTML={{ __html: item }}
          />
        ))}
      </ul>
    </div>
  );
}
