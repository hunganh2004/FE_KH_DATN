export default function ProductSpecs({ specs = [] }) {
  return (
    <div className="card overflow-hidden">
      <table className="w-full text-sm">
        <tbody>
          {specs.map((spec, i) => (
            <tr key={spec.pk_spec_id} className={i % 2 === 0 ? 'bg-stone-50' : 'bg-white'}>
              <td className="px-4 py-2.5 font-medium text-stone-600 w-2/5">{spec.spec_name}</td>
              <td className="px-4 py-2.5 text-stone-800">{spec.spec_value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
