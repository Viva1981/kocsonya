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

  // KONFIGURÁCIÓ
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzzC_6pVVnwU78r1KWNQkh_4vAwnZS54GZ4t7OQumlZNhSRB3-tJU09hhxafA0kdfmFBg/exec"; 
  const ADMIN_TOKEN = "KOCSONYA_SECRET_2026";

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === "miskolc2026") setIsAuthorized(true);
    else alert("Helytelen jelszó!");
  };

  useEffect(() => {
    if (isAuthorized) {
      if (activeTab === "submissions") fetchData("readSubmissions", setSubmissions);
      if (activeTab === "restaurants") fetchData("readRestaurants", setRestaurants);
    }
  }, [isAuthorized, activeTab]);

  const fetchData = async (action, setter) => {
    setLoading(true);
    try {
      const res = await fetch(SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify({ action, token: ADMIN_TOKEN })
      });
      const result = await res.json();
      if (result.ok) {
        const headers = result.data[0];
        const rows = result.data.slice(1).map((row, idx) => {
          let obj = { id: idx };
          headers.forEach((h, i) => {
             let key = h.toLowerCase().replace(/\s/g, "");
             if (key === "drivelink" || key === "imageurl") key = "imageUrl";
             if (key === "telefonszám") key = "phone";
             if (key === "név") key = "name";
             obj[key] = row[i];
          });
          return obj;
        });
        setter(action === "readSubmissions" ? rows.reverse() : rows);
      }
    } catch (e) { alert("Hiba az adatok letöltésekor."); }
    setLoading(false);
  };

  const saveEdit = async () => {
    setLoading(true);
    try {
      const res = await fetch(SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify({ 
          action: 'updateRestaurant', 
          token: ADMIN_TOKEN,
          originalName: editForm.originalName,
          name: editForm.name,
          address: editForm.address,
          menuHu: editForm.menuhu || editForm.menuHu,
          descHu: editForm.deschu || editForm.descHu || "",
          menuEn: editForm.menuen || editForm.menuEn,
          descEn: editForm.descen || editForm.descEn || "",
          price: editForm.price,
          active: editForm.active,
          imageUrl: editForm.imageUrl
        })
      });
      const result = await res.json();
      if (result.ok) {
        alert("Sikeres mentés!");
        setEditingId(null);
        fetchData("readRestaurants", setRestaurants);
      }
    } catch (e) { alert("Hiba a mentésnél."); }
    setLoading(false);
  };

  const getImg = (url) => {
    if (!url) return null;
    const id = url.match(/\/d\/(.*?)\/|id=(.*?)(&|$)/);
    return id ? `https://lh3.googleusercontent.com/d/${id[1] || id[2]}=w200` : null;
  };

  if (!isAuthorized) return (
    <Layout lang={lang} setLang={setLang}>
      <div className="max-w-md mx-auto mt-20 p-10 bg-white rounded-[2.5rem] soft-shadow text-center border">
        <h1 className="text-2xl font-serif font-bold text-[#387035] mb-6">Admin belépés</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-6 py-3 rounded-full border text-center outline-none focus:ring-2 focus:ring-[#77b92b]" placeholder="Jelszó" autoFocus />
          <button type="submit" className="w-full bg-[#387035] text-white py-4 rounded-full font-bold uppercase tracking-widest">Belépés</button>
        </form>
      </div>
    </Layout>
  );

  return (
    <Layout lang={lang} setLang={setLang}>
      <div className="max-w-7xl mx-auto py-10 px-4">
        <div className="flex gap-4 mb-10 bg-white p-2 rounded-full border w-fit mx-auto shadow-sm">
          <button onClick={() => setActiveTab("submissions")} className={`px-8 py-2 rounded-full font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'submissions' ? 'bg-[#387035] text-white' : 'text-slate-400'}`}>Nevezők</button>
          <button onClick={() => setActiveTab("restaurants")} className={`px-8 py-2 rounded-full font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'restaurants' ? 'bg-[#387035] text-white' : 'text-slate-400'}`}>Éttermek</button>
        </div>

        {loading ? <div className="text-center py-20 text-slate-400 animate-pulse font-serif italic text-xl">Szinkronizálás...</div> : (
          activeTab === "submissions" ? (
            <div className="bg-white rounded-[2.5rem] soft-shadow border overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#f4f9f2] text-[#387035] text-[10px] uppercase tracking-widest">
                  <tr><th className="p-6">Dátum</th><th className="p-6">Név</th><th className="p-6">Telefon</th><th className="p-6 text-center">Fotó</th></tr>
                </thead>
                <tbody className="divide-y text-slate-700">
                  {submissions.map((s, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="p-6 text-[10px] text-slate-400 font-mono whitespace-nowrap">{s.dátum || s.timestamp}</td>
                      <td className="p-6 font-bold">{s.name || "Névtelen"}</td>
                      <td className="p-6 text-sm">{s.phone}</td>
                      <td className="p-6 flex justify-center">
                        <img src={getImg(s.imageUrl)} className="w-16 h-16 object-cover rounded-lg border shadow-sm" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {restaurants.map((res) => (
                <div key={res.id} className="bg-white p-8 rounded-[2rem] border soft-shadow">
                  {editingId === res.id ? (
                    <div className="space-y-4">
                      <input className="w-full border p-4 rounded-2xl" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} placeholder="Név" />
                      <input className="w-full border p-4 rounded-2xl" value={editForm.price} onChange={e => setEditForm({...editForm, price: e.target.value})} placeholder="Ár" />
                      <input className="w-full border p-4 rounded-2xl" value={editForm.active} onChange={e => setEditForm({...editForm, active: e.target.value})} placeholder="Aktív (x)" />
                      <div className="flex gap-2">
                        <button onClick={saveEdit} className="bg-[#387035] text-white px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest">Mentés</button>
                        <button onClick={() => setEditingId(null)} className="bg-slate-100 text-slate-500 px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest">Mégsem</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-serif font-bold text-2xl text-[#387035]">{res.name || res.név}</h3>
                        <p className="text-slate-500">{res.price || res.ár} Ft | {res.active === 'x' || res.aktív === 'x' ? '✅ Aktív' : '❌ Inaktív'}</p>
                      </div>
                      <button onClick={() => { setEditingId(res.id); setEditForm({ ...res, originalName: res.name || res.név }); }} className="border-2 border-[#387035] text-[#387035] px-6 py-2 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-[#387035] hover:text-white transition-all">Szerkesztés</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </Layout>
  );
}