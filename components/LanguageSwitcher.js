export default function LanguageSwitcher({ lang, setLang, label }) {
  const isHu = lang === "hu";
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-slate-500">{label}</span>
      <div className="inline-flex rounded-xl border border-slate-200 p-1 bg-white">
        <button
          type="button"
          onClick={() => setLang("hu")}
          className={`px-3 py-1 text-sm rounded-lg ${
            isHu ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"
          }`}
        >
          HU
        </button>
        <button
          type="button"
          onClick={() => setLang("en")}
          className={`px-3 py-1 text-sm rounded-lg ${
            !isHu ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"
          }`}
        >
          EN
        </button>
      </div>
    </div>
  );
}
