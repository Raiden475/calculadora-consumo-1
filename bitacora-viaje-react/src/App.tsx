import type { Trip } from './models/types'
import { calculateStatics } from './utils/calculations'

function App() {
  const exampleTrip: Trip = {
    initKm: 10000,
    loads: [
      { km: 10400, liters: 30 },
      { km: 10850, liters: 35 }
    ]
  };

  const results = calculateStatics(exampleTrip);

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

            <button className="w-full bg-leaf text-white font-semibold tracking-wide rounded-xl py-3 hover:bg-leafLight transition active:scale-[0.98]">
              + Agregar Carga
            </button>
          </div>
        </div>

        {/* Tabla de cargas */}
        <div className="mb-6">
          <h2 className="font-serif text-xl text-gray-600 mb-4 pl-1">Cargas Registradas</h2>

          <label className="w-full flex flex-row align-center justify-start mb-1">
            Móvil inicia con: <span className="px-4 font-bold">{exampleTrip.initKm?.toFixed(2)} km</span>
          </label>

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
              <tbody id="tabla-historial">
                {exampleTrip.loads.map((load, index) => (
                  <tr key={index} className="border-b border-stone-100">
                    <td className="py-3 px-5 text-gray-400 font-mono text-xs">{index + 1}</td>
                    <td className="py-3 px-5 font-medium text-gray-700">{load.km} km</td>
                    <td className="py-3 px-5 text-gray-600">{load.liters} L</td>
                    <td className="py-3 px-5 text-green-600 text-xs font-medium">
                      {index === 0 ? 'Inicio' : `${load.km - exampleTrip.loads[index - 1].km} km`}
                    </td>
                  </tr>
                ))}
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

        {/* Resultado */}
        {results && (
          <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-lg text-sm">
            <p>Distancia: {results.totalDistance} km</p>
            <p>Promedio: {results.averageConsumption.toFixed(2)} L/100km</p>
          </div>
        )}

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