import dynamic from 'next/dynamic';
import Layout from "../components/Layout";
import { useLanguage } from "../components/useLanguage";
import Link from 'next/link';

// A Canvas komponens dinamikus betöltése (fontos Next.js-nél)
const PacmanGame = dynamic(() => import('../components/PacmanGame'), {
  ssr: false,
  loading: () => <p className="text-center text-white p-10 font-serif">Konyha előkészítése...</p>
});

export default function PacmanPage() {
  const { lang, setLang } = useLanguage();

  return (
    <Layout lang={lang} setLang={setLang}>
      <div className="min-h-screen bg-[#051f0e] -mt-32 pt-40 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          
          <h1 className="text-4xl sm:text-6xl font-serif font-bold text-[#C5A059] mb-4">
            Kocsonya <span className="text-white">Chase</span>
          </h1>
          <p className="text-[#aadd77] mb-12 font-light tracking-widest uppercase text-xs sm:text-sm opacity-80">
            A BÉKA MENEKÜL • A SÉFEK ÉHESEK • AZ ÉLMÉNY GARANTÁLT
          </p>

          <div className="mb-12">
            <PacmanGame />
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