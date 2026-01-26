import SpeechToText from "./components/SpeechToText";

export default function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#ededed] selection:bg-blue-500/30">
      <nav className="border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="font-bold text-xl tracking-tight">SIDDHI</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-medium text-gray-500 bg-white/5 px-2 py-1 rounded uppercase tracking-widest">v2.0 Enhanced</span>
          </div>
        </div>
      </nav>
      
      <main className="pt-12 px-4 sm:px-6 lg:px-8">
        <SpeechToText />
      </main>
      
      <footer className="border-t border-white/5 py-8 text-center text-gray-600 text-sm">
        <p>© 2026 Siddhi Medical ASR. All rights reserved.</p>
      </footer>
    </div>
  );
}
