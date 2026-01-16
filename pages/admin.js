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
  const SCRIPT_URL = "IDE_MÁSOLD_AZ_ÚJ_DEPLOY_URL-T"; 
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
             let rawKey = h.toString().toLowerCase().trim();
             let key = rawKey;
             
             // UNIVERZÁLIS MEZŐ LEKÉPEZÉS (Magyar -> Angol kód)
             if (rawKey.includes("név") || rawKey === "name") key = "name";
             if (rawKey.includes("cím") || rawKey === "address") key = "address";
             if (rawKey.includes("ár") || rawKey === "price") key = "price";
             if (rawKey.includes("aktív") || rawKey === "active") key = "active";
             if (rawKey.includes("menü hu") || rawKey === "menuhu") key = "menuHu";
             if (rawKey.includes("leírás hu") || rawKey === "deschu") key = "descHu";
             if (rawKey.includes("menü en") || rawKey === "menuen") key = "menuEn";
             if (rawKey.includes("leírás en") || rawKey === "descen") key = "descEn";
             if (rawKey.includes("kép") || rawKey.includes("drive link") || rawKey === "imageurl" || rawKey === "drivelink") key = "imageUrl";
             if (rawKey.includes("telefonszám") || rawKey === "phone") key = "phone";
             if (rawKey.includes("dátum") || rawKey === "timestamp") key = "timestamp";
             
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
          menuHu: editForm.menuHu,
          descHu: editForm.descHu || "",
          menuEn: editForm.menuEn,
          descEn: editForm.descEn || "",
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
    const idMatch = url.match(/\/d\/(.*?)\/|id=(.*?)(&|$)/);
    const id = idMatch ? (idMatch[1] || idMatch[2]) : null;
    return id ? `https://lh3.googleusercontent.com/d/${id}=w200` : null;
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
                  <tr>
                    <th className="p-6">Dátum</th>
                    <th className="p-6">Név</th>
                    <th className="p-6">Cím</th>
                    <th className="p-6">Telefon</th>
                    <th className="p-6 text-center">Fotó</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-700">
                  {submissions.map((s, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="p-6 text-[10px] text-slate-400 font-mono whitespace-nowrap">{s.timestamp}</td>
                      <td className="p-6 font-bold">{s.name}</td>
                      <td className="p-6 text-sm text-slate-500">{s.address}</td>
                      <td className="p-6 text-sm">{s.phone}</td>
                      <td className="p-6 flex justify-center">
                        <a href={s.imageUrl} target="_blank" rel="noopener noreferrer">
                            <img src={getImg(s.imageUrl)} className="w-16 h-16 object-cover rounded-lg border shadow-sm" />
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
                <div key={res.id} className="bg-white p-8 rounded-[2rem] border soft-shadow">
                  {editingId === res.id ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold uppercase text-slate-400">
                        <div><label className="ml-2">Név</label><input className="w-full border p-4 rounded-2xl text-slate-800 normal-case" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} /></div>
                        <div><label className="ml-2">Ár</label><input className="w-full border p-4 rounded-2xl text-slate-800 normal-case" value={editForm.price} onChange={e => setEditForm({...editForm, price: e.target.value})} /></div>
                        <div className="md:col-span-2"><label className="ml-2">Cím</label><input className="w-full border p-4 rounded-2xl text-slate-800 normal-case" value={editForm.address} onChange={e => setEditForm({...editForm, address: e.target.value})} /></div>
                        <div className="md:col-span-2"><label className="ml-2">Menü (HU)</label><input className="w-full border p-4 rounded-2xl text-slate-800 normal-case" value={editForm.menuHu} onChange={e => setEditForm({...editForm, menuHu: e.target.value})} /></div>
                        <div><label className="ml-2">Aktív (x)</label><input className="w-full border p-4 rounded-2xl text-slate-800 normal-case" value={editForm.active} onChange={e => setEditForm({...editForm, active: e.target.value})} /></div>
                        <div><label className="ml-2">Kép URL</label><input className="w-full border p-4 rounded-2xl text-slate-800 normal-case" value={editForm.imageUrl} onChange={e => setEditForm({...editForm, imageUrl: e.target.value})} /></div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={saveEdit} className="bg-[#387035] text-white px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest">Mentés</button>
                        <button onClick={() => setEditingId(null)} className="bg-slate-100 text-slate-500 px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest">Mégsem</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-serif font-bold text-2xl text-[#387035]">{res.name}</h3>
                        <p className="text-slate-500">{res.price} Ft | {res.active === 'x' ? '✅ Aktív' : '❌ Inaktív'}</p>
                        <p className="text-xs text-slate-400 italic mt-1">{res.menuHu}</p>
                      </div>
                      <button onClick={() => { setEditingId(res.id); setEditForm({ ...res, originalName: res.name }); }} className="border-2 border-[#387035] text-[#387035] px-6 py-2 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-[#387035] hover:text-white transition-all">Szerkesztés</button>
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