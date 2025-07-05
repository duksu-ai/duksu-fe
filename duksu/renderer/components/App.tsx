import { useState, useEffect } from 'react'

function App() {
  const [count, setCount] = useState(0);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/20">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">
            🚀 Duksu Electron
          </h1>
          <p className="text-white/80 mb-6">
            React + TypeScript + Tailwind
          </p>
          
          <div className="bg-white/10 rounded-2xl p-6 mb-6">
            <div className="text-6xl font-bold text-white mb-4">
              {count}
            </div>
            <div className="space-y-3">
              <button
                onClick={() => setCount(count + 1)}
                className="w-full bg-white/20 hover:bg-white/30 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 hover:scale-105"
              >
                Increment
              </button>
              <button
                onClick={() => setCount(count - 1)}
                className="w-full bg-white/20 hover:bg-white/30 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 hover:scale-105"
              >
                Decrement
              </button>
              <button
                onClick={() => setCount(0)}
                className="w-full bg-red-500/30 hover:bg-red-500/40 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 hover:scale-105"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-white/90 text-sm font-medium mb-2">IPC Event Tests:</div>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => (window as any).WindowAPI?.windowMinimize()}
                className="bg-yellow-500/30 hover:bg-yellow-500/40 text-white py-2 px-3 rounded-lg transition-all duration-200 text-sm"
              >
                Minimize
              </button>
              <button
                onClick={() => (window as any).WindowAPI?.windowMaximize()}
                className="bg-green-500/30 hover:bg-green-500/40 text-white py-2 px-3 rounded-lg transition-all duration-200 text-sm"
              >
                Maximize
              </button>
              <button
                onClick={() => (window as any).WindowAPI?.windowUnmaximize()}
                className="bg-blue-500/30 hover:bg-blue-500/40 text-white py-2 px-3 rounded-lg transition-all duration-200 text-sm"
              >
                Unmaximize
              </button>
              <button
                onClick={() => (window as any).WindowAPI?.windowHide()}
                className="bg-purple-500/30 hover:bg-purple-500/40 text-white py-2 px-3 rounded-lg transition-all duration-200 text-sm"
              >
                Hide
              </button>
              <button
                onClick={() => (window as any).WindowAPI?.windowResize(600, 400)}
                className="bg-orange-500/30 hover:bg-orange-500/40 text-white py-2 px-3 rounded-lg transition-all duration-200 text-sm"
              >
                Resize
              </button>
              <button
                onClick={() => (window as any).WindowAPI?.windowClose()}
                className="bg-red-500/30 hover:bg-red-500/40 text-white py-2 px-3 rounded-lg transition-all duration-200 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App 