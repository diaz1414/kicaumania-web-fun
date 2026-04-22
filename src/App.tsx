import { motion } from 'framer-motion'
import { Background3D } from './components/Background3D'
import { ChaosMode } from './components/ChaosMode'
import { ParticleSystem } from './components/ParticleSystem'
import { useAppStore } from './store'

function App() {
  const activateCamera = useAppStore(state => state.activateCamera)
  const isCameraActive = useAppStore(state => state.isCameraActive)

  return (
    <div className={`min-h-screen bg-slate-900 text-white relative overflow-hidden transition-opacity duration-700 ${isCameraActive ? 'bg-black' : ''}`}>
      {!isCameraActive && <Background3D />}

      {/* Particle & Chaos System always rendered but handles its own visibility */}
      <ParticleSystem />
      <ChaosMode />

      {/* Funny UI that disappears when camera is active */}
      {!isCameraActive && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.5 }}
          className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20 text-center"
        >
          {/* Viral Badge */}
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", delay: 0.8 }}
            className="mb-8 px-4 py-1.5 bg-pink-600 rounded-full flex items-center gap-2 border-2 border-white shadow-[0_0_20px_rgba(219,39,119,0.6)]"
          >
            <span className="text-xs font-black uppercase tracking-tighter italic">🔥 TRENDING ON TIKTOK</span>
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
          </motion.div>

          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.6, duration: 1 }}
            className="relative"
          >
            {/* Left Cat - Perched on K */}
            <motion.img
              src="/cat.gif"
              alt="Left Cat"
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2.2 }}
              className="absolute -top-8 md:-top-16 -left-4 md:-left-12 w-12 h-12 md:w-32 md:h-32 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] select-none pointer-events-none"
            />

            <h1 className="text-4xl sm:text-6xl md:text-9xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 tracking-tighter leading-tight">
              KICAU MANIA
            </h1>

            {/* Right Bird - Perched (Original Style) */}
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -top-8 md:-top-16 -right-4 md:-right-12 text-4xl md:text-8xl select-none"
            >
              🦜
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <p className="text-2xl md:text-3xl mb-4 font-bold text-white tracking-tight">
              Join the <span className="text-yellow-400 underline decoration-wavy underline-offset-8">#KicauManiaChallenge</span>
            </p>
            <p className="text-slate-400 text-lg md:text-xl font-medium max-w-xl mx-auto">
              Sistem Kucing Paling Gacor Se-Asia Tenggara. <br />
              Sudah dicoba oleh <span className="text-pink-500 font-black">2.4M+</span> Kicau Mania Gacor! 🚀
            </p>
          </motion.div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-yellow-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
            <motion.button
              onClick={activateCamera}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative px-12 py-6 bg-black rounded-full text-2xl md:text-3xl font-black uppercase tracking-widest border-2 border-white/20 text-white flex items-center gap-4 transition-all"
            >
              <span>COBA TREN INI</span>
              <span className="text-3xl animate-bounce">⚡</span>
            </motion.button>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-16 flex flex-col items-center gap-4"
          >
            <p className="text-sm text-slate-500 uppercase tracking-widest font-bold">
              Powered by AI Kucing Gacor v2.0
            </p>
            <div className="flex -space-x-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-xs overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-pink-600 flex items-center justify-center text-[10px] font-bold">
                +99k
              </div>
            </div>
          </motion.div>

          <p className="mt-12 text-xs text-slate-600 italic">
            *Peringatan: Kamera akan aktif untuk mendeteksi kegacoran tangan Anda.
          </p>
        </motion.div>
      )}
    </div>
  )
}

export default App
