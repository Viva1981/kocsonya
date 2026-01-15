import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useLanguage } from "../components/useLanguage";

// --- SEGÉDFÜGGVÉNY: Google Drive Linkek átalakítása ---
const getOptimizedImageUrl = (url) => {
  if (!url) return null;
  // Kezeli a Drive linkeket és a direkt linkeket is
  if (url.includes('drive.google.com') || url.includes('docs.google.com')) {
    const idMatch = url.match(/\/d\/(.*?)\/|id=(.*?)(&|$)/);
    const id = idMatch ? (idMatch[1] || idMatch[2]) : null;
    if (id) {
      return `https://lh3.googleusercontent.com/d/${id}=w400`; // Kicsit nagyobb felbontás az adminon
    }
  }
  return url;
};

// --- CSV PARSOLÓ (A TE TÁBLÁZATOD OSZLOPRENDJÉHEZ IGAZÍTVA) ---
const parseSubmissionsCSV = (text) => {
  if (!text) return [];
  const lines = text.split(/\r?\n/);
  const submissions = [];
  const csvRegex = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const row = line.split(csvRegex).map(cell => {
      return cell.replace(/^"|"$/g, '').replace(/""/g, '"').trim();
    });
    
    // OSZLOPREND ALAPJÁN (0:Dátum, 1:Név, 2:Cím, 3:Telefonszám, 4:Fájlnév, 5:Drive link, 6:Nyelv)
    if (row.length >= 6) {
      submissions.push({
        timestamp: row[0] || "",
        name: row[1] || "Névtelen",
        address: row[2] || "",
        phone: row[3] || "",
        filename: row[4] || "", // Fájlnév (opcionális)
        imageUrl: getOptimizedImageUrl(row[5] || ""), // Drive link a képhez
        rawUrl: row[5] || "", // Eredeti link a megnyitáshoz
        langTag: row[6] || "hu"
      });
    }
  }
  return submissions.reverse(); 
};

export default function AdminPage() {
  const { lang, setLang } = useLanguage();
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === "miskolc2026") { 
      setIsAuthorized(true);
    } else {
      alert("Helytelen jelszó!");
    }
  };

  useEffect(() => {
    if (isAuthorized) {
      fetchSubmissions();
    }
  }, [isAuthorized]);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const SHEET_ID = "1PEhrczS6BMouRLR0yUrLSDum0MnkqrgscpUFVSaJpJc";
      const GID = "0";
      const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=${GID}`;
      
      const res = await fetch(url, { cache: 'no-store' });
      const csvText = await res.text();
      const parsedData = parseSubmissionsCSV(csvText);
      setSubmissions(parsedData);
    } catch (error) {
      console.error("Hiba az adatok betöltésekor:", error);
    }
    setLoading(false);
  };

  if (!isAuthorized) {
    return (
      <Layout lang={lang} setLang={setLang}>
        <div className="max-w-md mx-auto mt-20 p-10 bg-white rounded-[2.5rem] soft-shadow border border-slate-100 text-center">
          <h1 className="text-2xl font-serif font-bold text-[#387035] mb-6">Admin belépés</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-3 rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#77b92b] text-center"
              placeholder="Jelszó"
              autoFocus
            />
            <button type="submit" className="w-full bg-[#387035] text-white py-4 rounded-full font-bold uppercase tracking-widest hover:bg-[#2a5528] transition-all">
              Belépés
            </button>
          </form>
        </div>
      </Layout>
    );
  }

  return (
    <Layout lang={lang} setLang={setLang}>
      <div className="max-w-7xl mx-auto py-10 px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-serif font-bold text-[#387035] mb-2">Beküldött nevezések</h1>
            <p className="text-slate-500 text-sm">Összesen: {submissions.length} nevező</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="https://docs.google.com/spreadsheets/d/1PEhrczS6BMouRLR0yUrLSDum0MnkqrgscpUFVSaJpJc/edit" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white border border-slate-200 text-slate-600 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2"
            >
              📊 Táblázat megnyitása
            </a>
            <button 
              onClick={fetchSubmissions} 
              className="bg-[#387035] text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#2a5528] transition-all shadow-md"
            >
              🔄 Frissítés
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-32">
            <div className="inline-block w-8 h-8 border-4 border-[#77b92b] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-400 font-serif italic text-xl">Adatok betöltése...</p>
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] soft-shadow border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f4f9f2] text-[#387035] uppercase text-[10px] tracking-[0.2em]">
                    <th className="p-6 font-bold">Dátum</th>
                    <th className="p-6 font-bold">Név</th>
                    <th className="p-6 font-bold">Elérhetőség / Cím</th>
                    <th className="p-6 font-bold text-center">Kocsonya Útlevél Fotó</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {submissions.map((sub, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors text-slate-700">
                      <td className="p-6 text-[10px] text-slate-400 font-mono whitespace-nowrap">{sub.timestamp}</td>
                      <td className="p-6 font-bold text-slate-900">{sub.name}</td>
                      <td className="p-6">
                        <div className="text-sm font-medium text-slate-800">{sub.phone}</div>
                        <div className="text-xs text-slate-500 mt-1">{sub.address}</div>
                        <div className="text-[9px] text-slate-400 mt-1 uppercase tracking-tighter">Nyelv: {sub.langTag}</div>
                      </td>
                      <td className="p-6 flex justify-center">
                        {sub.rawUrl ? (
                          <a href={sub.rawUrl} target="_blank" rel="noopener noreferrer" className="block group relative w-24">
                            <div className="w-24 h-24 rounded-2xl overflow-hidden border border-slate-200 shadow-sm group-hover:shadow-md transition-all">
                                {sub.imageUrl ? (
                                    <img 
                                        src={sub.imageUrl} 
                                        alt="Passport Photo" 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
                                    />
                                ) : null}
                                <div className="hidden w-full h-full bg-slate-100 flex-col items-center justify-center text-center p-2">
                                    <span className="text-[10px] text-slate-400 font-bold uppercase">Kép hiba</span>
                                    <span className="text-[8px] text-slate-300 mt-1">Kattints a megnyitáshoz</span>
                                </div>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="bg-[#387035]/90 text-white text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-md backdrop-blur-sm shadow-lg">Megnyitás</span>
                            </div>
                          </a>
                        ) : (
                          <span className="text-[10px] text-slate-300 italic uppercase tracking-widest font-bold">Nincs link</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}