import { useState, useEffect } from 'react';
import type { CalcResult, Load, Trip } from './models/types'
import { calculateStatics } from './utils/calculations'

function App() {
  const [trip, setTrip] = useState<Trip>(() => {
    const savedRecords = localStorage.getItem('bitacora_viaje');
    return savedRecords ? JSON.parse(savedRecords) : { initKm: null, loads: [] };
  });

  const [results, setResults] = useState<CalcResult | null>(() => {
    const initResults = calculateStatics(trip)
    return initResults
  });

  const [initKmInput, setInitKmInput] = useState<string>(trip.initKm?.toString() || '');
  const [kmInput, setKmInput] = useState<string>('');
  const [litersInput, setLitersInput] = useState<string>('');

  useEffect(() => {
    localStorage.setItem('bitacora_viaje', JSON.stringify(trip));
    setResults(calculateStatics(trip));
  }, [trip]);

  const addLoad = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newLoad: Load = {
      km: Number(kmInput),
      liters: Number(litersInput)
    };
    setTrip(prev => ({
      ...prev,
      loads: [...prev.loads, newLoad]
    }));
    setKmInput('');
    setLitersInput('');
  };

  const resetTrip = () => {
    if (confirm('¿Deseas borrar toda la bitácora?')) {
      setTrip({ initKm: null, loads: [] });
      setInitKmInput('');
    }
  };

  const finalizarViaje = async () => {
  if (!results || trip.loads.length < 2 || trip.initKm === null) {
    alert('Necesitás al menos 2 cargas para finalizar el viaje.');
    return;
  }

  const payload = {
    km_inicial:   trip.initKm,
    km_final:     trip.loads[trip.loads.length - 1].km,
    distancia_km: results.totalDistance,
    litros_total: results.totalLiters,
    consumo_l100: parseFloat(results.averageConsumption.toFixed(2)),
    cargas: trip.loads.map((load, index) => ({
      nro_carga:  index + 1,
      km:         load.km,
      litros:     load.liters,
      km_parcial: index === 0 ? null : load.km - trip.loads[index - 1].km
    }))
  };

  try {
    const res = await fetch('http://localhost:3000/api/viajes', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload)
    });
    const data = await res.json();
    alert(`✅ Viaje guardado en la base de datos (ID: ${data.viaje_id})`);
    resetTrip();
  } catch (err) {
    alert('❌ Error al guardar en la base de datos. ¿El backend está corriendo?');
  }
};

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

          <form onSubmit={addLoad} className="flex flex-col gap-5">

            {/* KM Inicial */}
            <div className="p-3 bg-leafPale rounded-xl border border-leafLight/30">
              <label className="block text-xs font-semibold uppercase tracking-widest text-leaf mb-2">
                KM Inicial del Vehículo
              </label>
              <input
                type="number"
                value={initKmInput}
                onChange={(e) => {
                  const valor = Number(e.target.value);
                  setInitKmInput(e.target.value);
                  setTrip(prev => ({ ...prev, initKm: valor }));
                }}
                disabled={trip.loads.length > 0}
                className={`w-full border rounded-xl px-4 py-3 text-gray-800 focus:outline-none transition ${
                  trip.loads.length > 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                    : 'bg-sand border-leafLight focus:ring-2 focus:ring-leafPale'
                }`}
                placeholder="Ej: 45000"
              />
              {trip.loads.length > 0 && (
                <p className="text-[10px] text-leaf mt-1 uppercase font-bold">
                  KM Inicial fijado — Limpiá el viaje para modificar
                </p>
              )}
            </div>

            {/* KM Actual */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-leafLight mb-2">
                Kilometraje Actual (km)
              </label>
              <input
                type="number"
                value={kmInput}
                onChange={(e) => setKmInput(e.target.value)}
                placeholder="Ej: 45320"
                required
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
                value={litersInput}
                onChange={(e) => setLitersInput(e.target.value)}
                placeholder="Ej: 45.00"
                required
                className="w-full border border-stone rounded-xl px-4 py-3 text-gray-800 bg-sand placeholder:text-gray-300 focus:outline-none focus:border-leafLight focus:ring-2 focus:ring-leafPale transition"
              />
            </div>

            <button type="submit" className="w-full bg-leaf text-white font-semibold tracking-wide rounded-xl py-3 hover:bg-leafLight transition active:scale-[0.98]">
              + Agregar Carga
            </button>
          </form>
        </div>

        {/* Tabla de cargas */}
        <div className="mb-6">
          <h2 className="font-serif text-xl text-gray-600 mb-4 pl-1">Cargas Registradas</h2>

          <label className="w-full flex flex-row items-center justify-start mb-2 text-sm">
            Móvil inicia con: <span className="px-4 font-bold">{trip.initKm?.toFixed(2) ?? '—'} km</span>
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
              <tbody>
                {trip.loads.length === 0 ? (
                  <tr>
                    <td className="py-3 px-5 text-gray-400 italic text-xs" colSpan={4}>
                      Sin cargas registradas
                    </td>
                  </tr>
                ) : (
                  trip.loads.map((load, index) => (
                    <tr key={index} className={`border-t border-stone-100 ${index % 2 === 0 ? 'bg-white' : 'bg-stone/30'}`}>
                      <td className="py-3 px-5 text-gray-400 font-mono text-xs">{index + 1}</td>
                      <td className="py-3 px-5 font-medium text-gray-700">{load.km.toLocaleString('es-AR')} km</td>
                      <td className="py-3 px-5 text-gray-600">{load.liters.toFixed(2)} L</td>
                      <td className="py-3 px-5 text-green-600 text-xs font-medium">
                        {index === 0 ? 'Inicio' : `${load.km - trip.loads[index - 1].km} km`}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Resultado */}
        {results ? (
          <div className="bg-leaf text-white rounded-3xl p-8 text-center shadow-md mb-6">
            <p className="text-leafPale text-xs uppercase tracking-widest mb-4">Resumen del Viaje</p>
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div>
                <p className="text-leafPale text-xs mb-1">Distancia</p>
                <p className="text-2xl font-serif">{results.totalDistance.toLocaleString('es-AR')}</p>
                <p className="text-leafPale text-xs">km</p>
              </div>
              <div>
                <p className="text-leafPale text-xs mb-1">Total Cargado</p>
                <p className="text-2xl font-serif">{results.totalLiters.toFixed(2)}</p>
                <p className="text-leafPale text-xs">litros</p>
              </div>
              <div>
                <p className="text-leafPale text-xs mb-1">Consumo</p>
                <p className="text-2xl font-serif">{results.averageConsumption.toFixed(2)}</p>
                <p className="text-leafPale text-xs">L/100km</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-400 italic text-sm mb-6">
            Completá los datos para ver el cálculo
          </p>
        )}

        {/* Botón Finalizar Viaje */}
        <button
          onClick={finalizarViaje}
          className="w-full bg-leaf text-white font-semibold tracking-wide rounded-xl py-4 hover:bg-leafLight transition active:scale-[0.98] shadow-sm mb-3"
        >
          🏁 Finalizar Viaje y Guardar en BD
        </button>

        {/* Botón Limpiar */}
        <button
          onClick={resetTrip}
          className="w-full bg-bark text-white font-semibold tracking-wide rounded-xl py-4 hover:opacity-90 transition active:scale-[0.98] shadow-sm mb-6"
        >
          🗑️ Descartar Viaje
        </button>

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