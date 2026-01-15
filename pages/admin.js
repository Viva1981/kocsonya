import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useLanguage } from "../components/useLanguage";

// --- SEGÉDFÜGGVÉNY: Google Drive Linkek átalakítása ---
const getOptimizedImageUrl = (url) => {
  if (!url) return null;
  if (url.includes('drive.google.com') || url.includes('docs.google.com')) {
    const idMatch = url.match(/\/d\/(.*?)\/|id=(.*?)(&|$)/);
    const id = idMatch ? (idMatch[1] || idMatch[2]) : null;
    if (id) {
      return `https://lh3.googleusercontent.com/d/${id}=w200`; // Kisebb méret az admin listához
    }
  }
  return url;
};

// --- CSV PARSOLÓ A NEVEZŐKHÖZ ---
const parseSubmissionsCSV = (text) => {
  const lines = text.split("\n");
  const submissions = [];
  const csvRegex = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;

  // Az első sort (fejléc) kihagyjuk
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const row = lines[i].split(csvRegex).map(cell => {
      let clean = cell.trim().replace(/^"|"$/g, '').replace(/""/g, '"');
      return clean;
    });
    
    // Feltételezett sorrend a táblázatodban: Időbélyeg, Név, Lakcím, Telefon, DriveLink
    submissions.push({
      timestamp: row[0],
      name: row[1],
      address: row[2],
      phone: row[3],
      imageUrl: getOptimizedImageUrl(row[4]),
      rawUrl: row[4]
    });
  }
  return submissions.reverse(); // A legfrissebb legyen legfelül
};

export default function AdminPage() {
  const { lang, setLang } = useLanguage();
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- JELSZÓ ELLENŐRZÉS ---
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
      // Frissítve az új táblázatod adataival
      const SHEET_ID = "1PEhrczS6BMouRLR0yUrLSDum0MnkqrgscpUFVSaJpJc";
      const GID = "0";
      const response = await fetch(`https://docs.google.com/spreadsheets/d/e/2PACX-1vS_76eS_n5U5A99-pAnf_X5YxS5NToj0oWqS8oV_30o9988_00/pub?gid=${GID}&single=true&output=csv&t=${Date.now()}`);
      
      // Megjegyzés: A fenti URL-t a Google Sheets-ben publikálni kell CSV-ként, 
      // de addig is itt a közvetlen export link az új ID-ddel:
      const directUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID}&t=${Date.now()}`;
      
      const res = await fetch(directUrl);
      const csvText = await res.text();
      setSubmissions(parseSubmissionsCSV(csvText));
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
              className="w-full px-6 py-3 rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#77b92b]"
              placeholder="Jelszó"
            />
            <button type="submit" className="w-full bg-[#387035] text-white py-3 rounded-full font-bold uppercase tracking-widest hover:bg-[#2a5528] transition-all">
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
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <h1 className="text-4xl font-serif font-bold text-[#387035]">Beküldött nevezések</h1>
          <div className="flex gap-4">
            <a 
              href="https://docs.google.com/spreadsheets/d/1PEhrczS6BMouRLR0yUrLSDum0MnkqrgscpUFVSaJpJc/edit" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white border border-slate-200 text-slate-600 px-6 py-2 rounded-full text-sm font-bold hover:bg-slate-50 transition-all flex items-center gap-2"
            >
              📊 Táblázat megnyitása
            </a>
            <button onClick={fetchSubmissions} className="bg-[#77b92b] text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-[#66a325] transition-all">
              🔄 Frissítés
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-400 animate-pulse font-serif italic text-xl">Adatok betöltése...</div>
        ) : (
          <div className="bg-white rounded-[2.5rem] soft-shadow border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f4f9f2] text-[#387035] uppercase text-xs tracking-[0.15em]">
                    <th className="p-6 font-bold">Dátum</th>
                    <th className="p-6 font-bold">Név</th>
                    <th className="p-6 font-bold">Elérhetőség</th>
                    <th className="p-6 font-bold">Kocsonya Útlevél Fotó</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {submissions.map((sub, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors text-slate-700">
                      <td className="p-6 text-[10px] text-slate-400 font-mono whitespace-nowrap">{sub.timestamp}</td>
                      <td className="p-6 font-bold text-slate-900">{sub.name}</td>
                      <td className="p-6">
                        <div className="text-sm font-medium">{sub.address}</div>
                        <div className="text-sm text-[#387035]">{sub.phone}</div>
                      </td>
                      <td className="p-6">
                        {sub.imageUrl ? (
                          <a href={sub.rawUrl} target="_blank" rel="noopener noreferrer" className="block group relative w-24">
                            <img 
                              src={sub.imageUrl} 
                              alt="Passport" 
                              className="w-24 h-24 object-cover rounded-xl border border-slate-200 group-hover:opacity-80 transition-all shadow-sm"
                            />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="bg-black/50 text-white text-[10px] px-2 py-1 rounded-md backdrop-blur-sm">Megnyitás</span>
                            </div>
                          </a>
                        ) : (
                          <span className="text-xs text-slate-300 italic">Nincs kép</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {submissions.length === 0 && (
              <div className="py-20 text-center text-slate-400 font-serif italic">Még nem érkezett nevezés.</div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}