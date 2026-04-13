function App() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-2xl border-t-4 border-cyan-500">
        <h1 className="text-3xl font-bold text-slate-800">
          Tailwind <span className="text-cyan-600">v4</span> funcionando 🚀
        </h1>
        <p className="mt-2 text-slate-600">
          Node 22 + Vite + React + TS
        </p>
        <button className="mt-4 px-6 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors">
          Probar botón
        </button>
      </div>
    </div>
  )
}
export default App