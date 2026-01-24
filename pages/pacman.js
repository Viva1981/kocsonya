import dynamic from 'next/dynamic';
import Layout from "../components/Layout";
import { useLanguage } from "../components/useLanguage";
import Link from 'next/link';

// A Canvas komponens dinamikus betöltése
const PacmanGame = dynamic(() => import('../components/PacmanGame'), {
  ssr: false,
  loading: () => <p className="text-center text-white p-10 font-serif">Konyha előkészítése...</p>
});

const RESTAURANTS = [
  "Renomé Cafe & Bistro",
  "Lignum Bistro & Café",
  "Pizza, Kávé, Világbéke",
  "Rockabilly Chicken",
  "Öreg Halász Étterem",
  "A LEVES és BURGER",
  "Creppy PalacsintaHáz Étterem & Center",
  "Babylon Pizzéria, Vendégház",
  "Vendéglő a Pisztrángoshoz",
  "Rossita Étterem",
  "Aranykorona Történelmi Étterem & Látványpince",
  "The Club Avalon",
  "Impresszó Club-Étterem",
  "Végállomás bistro&wine",
  "Népkerti Vigadó és DÉLIDŐ Étterem",
  "Calypso Kisvendéglő",
  "Ciao Martin Étterem",
  "Dűlő Étterem",
  "Hotel Palota Lillafüred",
  "Lestyán Gasztro & Bar",
  "Régiposta Kisvendéglő",
  "Süt a Nap Mentes Vegán Bisztró",
  "Murphy’s Étterem"
];

export default function PacmanPage() {
  const { lang, setLang } = useLanguage();

  return (
    <Layout lang={lang} setLang={setLang}>
      {/* Inline stílus az animációhoz, hogy ne kelljen globális CSS-t bántani */}
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          animation: marquee 40s linear infinite;
        }
      `}</style>

      <div className="min-h-screen bg-[#051f0e] -mt-32 pt-40 pb-20 px-4 flex flex-col items-center">
        <div className="max-w-4xl w-full mx-auto text-center z-10">
          
          <h1 className="text-4xl sm:text-6xl font-serif font-bold text-[#C5A059] mb-4 drop-shadow-lg">
            Kocsonya <span className="text-white">Run</span>
          </h1>
          <p className="text-[#aadd77] mb-8 font-light tracking-widest uppercase text-xs sm:text-sm opacity-80">
            • A BÉKA VAGY A SÉFEK NYERNEK? • 
          </p>

          <div className="mb-12">
            <PacmanGame />
          </div>

          {/* ÉTTEREM TICKER (MARQUEE) */}
          <div className="w-full overflow-hidden bg-[#0a2e16] border-y border-[#C5A059] py-3 mb-12 relative">
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#051f0e] to-transparent z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#051f0e] to-transparent z-10"></div>
            
            <div className="animate-marquee whitespace-nowrap">
                {/* Duplázzuk a listát a folyamatos loop érdekében */}
                {[...RESTAURANTS, ...RESTAURANTS].map((rest, index) => (
                  <span key={index} className="mx-6 text-[#C5A059] font-serif italic text-lg opacity-80 flex items-center">
                    <span className="w-2 h-2 bg-[#aadd77] rounded-full mr-3 animate-pulse"></span>
                    {rest}
                  </span>
                ))}
            </div>
          </div>

          <div className="flex justify-center gap-6">
            <Link 
              href="/" 
              className="px-8 py-3 rounded-full border border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059] hover:text-[#051f0e] transition-all font-bold uppercase text-xs tracking-widest"
            >
              Vissza a Főoldalra
            </Link>
          </div>

        </div>
      </div>
    </Layout>
  );
}