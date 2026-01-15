import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useLanguage } from "../components/useLanguage";

export default function AdminPage() {
  const { lang, setLang } = useLanguage();
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState("submissions"); 
  const [submissions, setSubmissions] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const SHEET_ID = "1PEhrczS6BMouRLR0yUrLSDum0MnkqrgscpUFVSaJpJc";
  
  // IDE MÁSOLD BE AZ ÚJ GOOGLE SCRIPT URL-EDET, AMIT A DEPLOY UTÁN KAPTÁL!
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycby3LbEj91ON6sO0AAbywi_bD7T0KnXxFdn1dHc4pFxUzqTIsz2uRHXffwRU1sEBt7GPaQ/exec"; 

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === "miskolc2026") setIsAuthorized(true);
    else alert("Helytelen jelszó!");
  };

  useEffect(() => {
    if (isAuthorized) {
      if (activeTab === "submissions") fetchSubmissions();
      if (activeTab === "restaurants") fetchRestaurants();
    }
  }, [isAuthorized, activeTab]);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=0`;
      const res = await fetch(url, { cache: 'no-store' });
      const text = await res.text();
      const lines = text.split(/\r?\n/).slice(1);
      const data = lines.map(line => {
        const row = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.replace(/^"|"$/g, '').trim());
        return { 
          timestamp: row[0], 
          name: row[1], 
          phone: row[3], 
          address: row[2],
          imageUrl: row[5]?.includes('id=') || row[5]?.includes('/d/') ? `https://lh3.googleusercontent.com/d/${row[5].match(/\/d\/(.*?)\/|id=(.*?)(&|$)/)[1] || row[5].match(/\/d\/(.*?)\/|id=(.*?)(&|$)/)[2]}=w200` : null,
          rawUrl: row[5]
        };
      });
      setSubmissions(data.reverse());
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=666430223`;
      const res = await fetch(url, { cache: 'no-store' });
      const text = await res.text();
      const lines = text.split(/\r?\n/).slice(1);
      const data = lines.map((line, idx) => {
        const r = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.replace(/^"|"$/g, '').trim());
        return { id: idx, name: r[0], address: r[1], menuHu: r[2], descHu: r[3], menuEn: r[4], descEn: r[5], price: r[6], active: r[7], imageUrl: r[8] };
      });
      setRestaurants(data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const startEdit = (res) => {
    setEditingId(res.id);
    setEditForm({ ...res, originalName: res.name });
  };

  const saveEdit = async () => {
    setLoading(true);
    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify({ action: 'updateRestaurant', ...editForm })
      });
      alert("Mentve! A táblázat frissítése pár másodpercig eltarthat.");
      setEditingId(null);
      fetchRestaurants();
    } catch (e) { alert("Hiba történt. Ellenőrizd a Script URL-t és a jogosultságokat."); }
    setLoading(false);
  };

  if (!isAuthorized) return (
    <Layout lang={lang} setLang={setLang}>
      <div className="max-w-md mx-auto mt-20 p-10 bg-white rounded-[2.5rem] soft-shadow text-center border">
        <h1 className="text-2xl font-serif font-bold text-[#387035] mb-6">Admin belépés</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-6 py-3 rounded-full border text-center" placeholder="Jelszó" autoFocus />
          <button type="submit" className="w-full bg-[#387035] text-white py-4 rounded-full font-bold uppercase tracking-widest shadow-md">Belépés</button>
        </form>
      </div>
    </Layout>
  );

  return (
    <Layout lang={lang} setLang={setLang}>
      <div className="max-w-7xl mx-auto py-10 px-4">
        <div className="flex gap-4 mb-10 bg-white p-2 rounded-full border w-fit mx-auto shadow-sm">
          <button onClick={() => setActiveTab("submissions")} className={`px-8 py-2 rounded-full font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'submissions' ? 'bg-[#387035] text-white shadow-md' : 'text-slate-400'}`}>Nevezők</button>
          <button onClick={() => setActiveTab("restaurants")} className={`px-8 py-2 rounded-full font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'restaurants' ? 'bg-[#387035] text-white shadow-md' : 'text-slate-400'}`}>Éttermek</button>
        </div>

        {activeTab === "submissions" ? (
          <div className="bg-white rounded-[2.5rem] soft-shadow border overflow-hidden overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#f4f9f2] text-[#387035] text-[10px] uppercase tracking-[0.2em]">
                <tr><th className="p-6">Dátum</th><th className="p-6">Név</th><th className="p-6">Elérhetőség</th><th className="p-6 text-center">Fotó</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {submissions.map((s, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="p-6 text-[10px] text-slate-400 font-mono whitespace-nowrap">{s.timestamp}</td>
                    <td className="p-6 font-bold text-slate-900">{s.name}</td>
                    <td className="p-6">
                        <div className="text-sm font-medium">{s.phone}</div>
                        <div className="text-xs text-slate-500">{s.address}</div>
                    </td>
                    <td className="p-6 flex justify-center">
                      <a href={s.rawUrl} target="_blank" rel="noopener noreferrer">
                         <img src={s.imageUrl} className="w-20 h-20 object-cover rounded-xl border shadow-sm hover:scale-105 transition-all" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {restaurants.map((res) => (
              <div key={res.id} className="bg-white p-8 rounded-[2rem] border soft-shadow transition-all hover:border-[#77b92b]/30">
                {editingId === res.id ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] uppercase font-bold text-slate-400 pl-2">Étterem neve</label>
                            <input className="border p-4 rounded-2xl text-sm focus:ring-2 focus:ring-[#77b92b] outline-none" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] uppercase font-bold text-slate-400 pl-2">Ár (Ft)</label>
                            <input className="border p-4 rounded-2xl text-sm focus:ring-2 focus:ring-[#77b92b] outline-none" value={editForm.price} onChange={e => setEditForm({...editForm, price: e.target.value})} />
                        </div>
                        <div className="flex flex-col gap-1 md:col-span-2">
                            <label className="text-[10px] uppercase font-bold text-slate-400 pl-2">Menü neve (Magyar)</label>
                            <input className="border p-4 rounded-2xl text-sm focus:ring-2 focus:ring-[#77b92b] outline-none" value={editForm.menuHu} onChange={e => setEditForm({...editForm, menuHu: e.target.value})} />
                        </div>
                        <div className="flex flex-col gap-1 md:col-span-2">
                            <label className="text-[10px] uppercase font-bold text-slate-400 pl-2">Aktív (x = látható az oldalon)</label>
                            <input className="border p-4 rounded-2xl text-sm focus:ring-2 focus:ring-[#77b92b] outline-none" value={editForm.active} onChange={e => setEditForm({...editForm, active: e.target.value})} />
                        </div>
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button onClick={saveEdit} className="bg-[#387035] text-white px-10 py-3 rounded-full font-bold text-xs uppercase tracking-widest shadow-lg hover:bg-[#2a5528] transition-all">Mentés</button>
                      <button onClick={() => setEditingId(null)} className="bg-slate-100 text-slate-500 px-10 py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">Mégsem</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-[#f4f9f2] rounded-2xl flex items-center justify-center text-[#387035] font-bold border border-[#e6f0e4]">
                            {res.active === 'x' ? '✅' : '❌'}
                        </div>
                        <div>
                            <h3 className="font-serif font-bold text-2xl text-[#387035]">{res.name}</h3>
                            <p className="text-slate-500 text-sm italic">{res.menuHu} — <span className="font-bold text-[#387035]">{res.price} Ft</span></p>
                        </div>
                    </div>
                    <button onClick={() => startEdit(res)} className="w-full md:w-auto border-2 border-[#387035] text-[#387035] px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-[#387035] hover:text-white transition-all">Szerkesztés</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}