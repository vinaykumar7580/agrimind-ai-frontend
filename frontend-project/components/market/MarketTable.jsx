export default function MarketTable({
  data,
}) {
  if (!data || !data.length) return null;

  return (
    <div className="bg-white p-6 rounded shadow mt-4">

      <h2 className="text-xl font-bold mb-4">
        📈 Market Prices
      </h2>

      <table className="w-full border">

        <thead>
          <tr className="bg-gray-100">

            <th className="p-2">Crop</th>

            <th className="p-2">Price (₹)</th>

            <th className="p-2">Trend</th>

          </tr>
        </thead>

        <tbody>

          {data.map((item, i) => (

            <tr key={i} className="border-t">

              <td className="p-2">
                {item.crop}
              </td>

              <td className="p-2">
                {item.price}
              </td>

              <td className="p-2">
                {item.trend}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}