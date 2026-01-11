import { useState } from "react";
import Layout from "../components/Layout";
import { useLanguage } from "../components/useLanguage";
import { TEXTS } from "../data/texts";

export default function UploadPage() {
  const { lang, setLang } = useLanguage();
  const t = TEXTS[lang];

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [file, setFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(e) {
    e.preventDefault();
    // Ebben a körben még nem küldünk feltöltést.
    // A Drive bekötése után a következő körben kötjük be a valódi beküldést.
    setSubmitted(true);
  }

  return (
    <Layout t={t} lang={lang} setLang={setLang}>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          {t.form.title}
        </h1>
        <p className="mt-3 text-sm text-slate-600">{t.form.note}</p>

        {submitted ? (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="font-semibold">{t.form.successTitle}</div>
            <p className="mt-2 text-slate-700">{t.form.successText}</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                {t.form.fields.name}
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-400"
                placeholder=""
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                {t.form.fields.address}
              </label>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-400"
                placeholder=""
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                {t.form.fields.phone}
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-400"
                placeholder=""
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                {t.form.fields.file}
              </label>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm"
                  required
                />

                <div className="text-sm text-slate-600">
                  {file ? (
                    <>
                      <span className="font-medium">{t.form.selected}:</span>{" "}
                      {file.name}
                    </>
                  ) : null}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl bg-slate-300 px-5 py-3 text-slate-700 font-medium cursor-not-allowed"
              title="A beküldés a Drive bekötése után lesz éles."
            >
              {t.form.submit}
            </button>
          </form>
        )}
      </section>
    </Layout>
  );
}
