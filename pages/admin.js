import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useLanguage } from "../components/useLanguage";

export default function AdminPage() {
  const { lang, setLang } = useLanguage();
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState("submissions"); // submissions | restaurants
  const [submissions, setSubmissions] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const SHEET_ID = "1PEhrczS6BMouRLR0yUrLSDum0MnkqrgscpUFVSaJpJc";
  const SCRIPT_URL = "IDE_MÁSOLD_BE_A_GOOGLE_SCRIPT_URL_EDET"; // A webapp URL-je

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
        return { timestamp: row[0], name: row[1], phone: row[3], imageUrl: row[5]?.replace(/\/d\/(.*?)\/.*/, 'https://lh3.googleusercontent.com/d/$1=w200') };
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
        mode: 'no-cors',
        body: JSON.stringify({ action: 'updateRestaurant', ...editForm })
      });
      alert("Mentve! (A táblázat frissítése pár másodpercbe telhet)");
      setEditingId(null);
      fetchRestaurants();
    } catch (e) { alert("Hiba a mentésnél."); }
    setLoading(false);
  };

  if (!isAuthorized) return (
    <Layout lang={lang} setLang={setLang}>
      <div className="max-w-md mx-auto mt-20 p-10 bg-white rounded-[2.5rem] soft-shadow text-center border">
        <h1 className="text-2xl font-serif font-bold text-[#387035] mb-6">Admin belépés</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-6 py-3 rounded-full border" placeholder="Jelszó" autoFocus />
          <button type="submit" className="w-full bg-[#387035] text-white py-4 rounded-full font-bold uppercase tracking-widest">Belépés</button>
        </form>
      </div>
    </Layout>
  );

  return (
    <Layout lang={lang} setLang={setLang}>
      <div className="max-w-7xl mx-auto py-10 px-4">
        <div className="flex gap-4 mb-10 bg-white p-2 rounded-full border w-fit mx-auto shadow-sm">
          <button onClick={() => setActiveTab("submissions")} className={`px-8 py-2 rounded-full font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'submissions' ? 'bg-[#387035] text-white shadow-md' : 'text-slate-400'}`}>Nevezők</button>
          <button onClick={() => setActiveTab("restaurants")} className={`px-8 py-2 rounded-full font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'restaurants' ? 'bg-[#387035] text-white shadow-md' : 'text-slate-400'}`}>Éttermek szerkesztése</button>
        </div>

        {activeTab === "submissions" ? (
          <div className="bg-white rounded-[2.5rem] soft-shadow border overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-[#f4f9f2] text-[#387035] text-[10px] uppercase tracking-widest">
                <tr><th className="p-6">Név</th><th className="p-6">Telefon</th><th className="p-6 text-center">Fotó</th></tr>
              </thead>
              <tbody className="divide-y">
                {submissions.map((s, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="p-6 font-bold">{s.name}</td>
                    <td className="p-6 text-sm">{s.phone}</td>
                    <td className="p-6 flex justify-center"><img src={s.imageUrl} className="w-16 h-16 object-cover rounded-lg border" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {restaurants.map((res) => (
              <div key={res.id} className="bg-white p-6 rounded-3xl border soft-shadow">
                {editingId === res.id ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input className="border p-3 rounded-xl text-sm" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} placeholder="Név" />
                    <input className="border p-3 rounded-xl text-sm" value={editForm.price} onChange={e => setEditForm({...editForm, price: e.target.value})} placeholder="Ár (Ft)" />
                    <textarea className="border p-3 rounded-xl text-sm md:col-span-2" value={editForm.menuHu} onChange={e => setEditForm({...editForm, menuHu: e.target.value})} placeholder="Menü (HU)" />
                    <input className="border p-3 rounded-xl text-sm md:col-span-2" value={editForm.imageUrl} onChange={e => setEditForm({...editForm, imageUrl: e.target.value})} placeholder="Kép URL" />
                    <div className="flex gap-2">
                      <button onClick={saveEdit} className="bg-[#387035] text-white px-6 py-2 rounded-full font-bold text-xs uppercase">Mentés</button>
                      <button onClick={() => setEditingId(null)} className="bg-slate-100 text-slate-500 px-6 py-2 rounded-full font-bold text-xs uppercase">Mégsem</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-lg">{res.name}</h3>
                      <p className="text-xs text-slate-400">{res.active === 'x' ? '✅ Aktív' : '❌ Inaktív'} | {res.price} Ft</p>
                    </div>
                    <button onClick={() => startEdit(res)} className="border border-[#387035] text-[#387035] px-6 py-2 rounded-full font-bold text-xs uppercase hover:bg-[#387035] hover:text-white transition-all">Szerkesztés</button>
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