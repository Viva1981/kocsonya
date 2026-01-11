export default function RestaurantList({ t, restaurants, lang }) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold">{t.restaurants.title}</h2>
      <p className="text-sm text-slate-600 mt-1">{t.restaurants.note}</p>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="text-left px-4 py-3">{t.restaurants.columns.name}</th>
              <th className="text-left px-4 py-3">{t.restaurants.columns.address}</th>
              <th className="text-left px-4 py-3">{t.restaurants.columns.product}</th>
              <th className="text-left px-4 py-3">{t.restaurants.columns.price}</th>
            </tr>
          </thead>
          <tbody>
            {restaurants.map((r) => (
              <tr key={r.id} className="border-t border-slate-200">
                <td className="px-4 py-3 font-medium">{r.name[lang]}</td>
                <td className="px-4 py-3">{r.address[lang]}</td>
                <td className="px-4 py-3">{r.product[lang]}</td>
                <td className="px-4 py-3 whitespace-nowrap">{r.price[lang]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
