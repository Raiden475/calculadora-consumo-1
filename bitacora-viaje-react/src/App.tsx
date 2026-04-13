function App() {
  return (
    <div className="bg-sand font-sans text-gray-700 min-h-screen flex items-start justify-center py-12 px-4">
      <div className="w-full max-w-xl">

        {/* Header */}
        <header className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="text-3xl">🌿</span>
            <h1 className="font-serif text-4xl text-leaf">LogiRuta</h1>
          </div>
          <p className="text-sm text-gray-400 tracking-widest uppercase">Bitácora de Consumo de Combustible</p>
        </header>

        {/* Tarjeta principal */}
        <div className="bg-white rounded-3xl shadow-sm border border-stone p-8 mb-6">
          <h2 className="font-serif text-xl text-gray-600 mb-6">Registrar Carga</h2>
          <div className="flex flex-col gap-5">

            {/* Kilometraje */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-leafLight mb-2">
                Kilometraje Actual (km)
              </label>
              <input
                type="number"
                placeholder="Ej: 45320"
                className="w-full border border-stone rounded-xl px-4 py-3 text-gray-800 bg-sand placeholder:text-gray-300 focus:outline-none focus:border-leafLight focus:ring-2 focus:ring-leafPale transition"
              />
            </div>

            {/* Litros */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-leafLight mb-2">
                Litros Cargados (L)
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="Ej: 45.00"
                className="w-full border border-stone rounded-xl px-4 py-3 text-gray-800 bg-sand placeholder:text-gray-300 focus:outline-none focus:border-leafLight focus:ring-2 focus:ring-leafPale transition"
              />
            </div>

            {/* Botón Agregar */}
            <button className="w-full bg-leaf text-white font-semibold tracking-wide rounded-xl py-3 hover:bg-leafLight transition active:scale-[0.98]">
              + Agregar Carga
            </button>
          </div>
        </div>

        {/* Tabla de cargas */}
        <div className="mb-6">
          <h2 className="font-serif text-xl text-gray-600 mb-4 pl-1">Cargas Registradas</h2>
          <div className="bg-white rounded-3xl border border-stone shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-leafPale text-leaf text-xs uppercase tracking-wider">
                  <th className="py-3 px-5 text-left font-semibold">#</th>
                  <th className="py-3 px-5 text-left font-semibold">Kilometraje</th>
                  <th className="py-3 px-5 text-left font-semibold">Litros</th>
                  <th className="py-3 px-5 text-left font-semibold">Parcial</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-stone-100">
                  <td className="py-3 px-5 text-gray-400 font-mono text-xs" colSpan={4}>
                    Sin cargas registradas
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Botón Finalizar */}
        <div className="mb-6">
          <button className="w-full bg-bark text-white font-semibold tracking-wide rounded-xl py-4 hover:opacity-90 transition active:scale-[0.98] shadow-sm">
            🏁 Finalizar Viaje y Calcular
          </button>
        </div>

        {/* Footer */}
        <footer className="text-center text-xs text-gray-300 mt-10">
          LogiRuta © 2026 · Herramienta para choferes
          <br />
          Creado por Raul Camacho
        </footer>

      </div>
    </div>
  )
}

export default App