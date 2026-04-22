import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../store'

// Ganti link ini dengan link MP3 Kicau Mania Remix yang asli!
const KICAU_MANIA_AUDIO = "/music.mp3"
const CAT_GIF_URL = "/cat.gif"
const WINDAH_GIF_URL = "/windah.gif"

export function ParticleSystem() {
  const isChaosMode = useAppStore(state => state.isChaosMode)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (isChaosMode && audioRef.current) {
      audioRef.current.play().catch(e => console.error("Audio play failed:", e))
    } else if (!isChaosMode && audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }, [isChaosMode])

  // Generate counts based on screen width
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const particleCount = isMobile ? 10 : 25
  const staticCount = isMobile ? 8 : 20

  // Generate random cats only, and make them slower (floating up)
  const particles = Array.from({ length: particleCount }).map((_, i) => ({
    id: i,
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    scale: (Math.random() * 0.8 + 0.5) * (isMobile ? 0.6 : 1), 
    rotation: Math.random() * 360,
    delay: Math.random() * 2,
    duration: 5 + Math.random() * 5
  }))

  // Static/Stay particles (stay in place)
  const staticParticles = Array.from({ length: staticCount }).map((_, i) => ({
    id: i,
    type: Math.random() > 0.6 ? 'windah' : 'cat',
    x: Math.random() * 90, // percent
    y: Math.random() * 90, // percent
    scale: (Math.random() * 1.2 + 0.6) * (isMobile ? 0.5 : 1),
    rotation: Math.random() > 0.7 ? 180 : (Math.random() * 40 - 20),
    delay: i * 0.2
  }))

  return (
    <>
      <audio ref={audioRef} src={KICAU_MANIA_AUDIO} loop />
      <AnimatePresence>
        {isChaosMode && (
          <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
            {particles.map(p => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, x: p.x, y: window.innerHeight + 200, rotate: p.rotation, scale: p.scale }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  y: -200,
                  x: p.x + (Math.random() - 0.5) * 600,
                  rotate: p.rotation + 720
                }}
                transition={{
                  duration: p.duration,
                  repeat: Infinity,
                  delay: p.delay,
                  ease: "linear"
                }}
                className="absolute"
              >
                <img
                  src={CAT_GIF_URL}
                  alt="Kicau Mania Effect"
                  className="w-32 h-32 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] opacity-70"
                />
              </motion.div>
            ))}

            {/* Static Stay Particles */}
            {staticParticles.map(p => (
              <motion.div
                key={`static-${p.id}`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.7, scale: p.scale }}
                transition={{ duration: 3, delay: p.delay, ease: "easeOut" }}
                style={{ left: `${p.x}%`, top: `${p.y}%`, rotate: p.rotation }}
                className="absolute z-[90] pointer-events-none"
              >
                <motion.img
                  src={p.type === 'cat' ? CAT_GIF_URL : WINDAH_GIF_URL}
                  alt="Stay Effect"
                  animate={{ 
                    y: [0, 10, 0],
                    rotate: [p.rotation - 5, p.rotation + 5, p.rotation - 5]
                  }}
                  transition={{ repeat: Infinity, duration: 4 + Math.random() * 2, ease: "easeInOut" }}
                  className="w-32 h-32 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                />
              </motion.div>
            ))}

            {/* Persistent Hero Elements */}
            <motion.div
              initial={{ opacity: 0, x: -100, y: 100 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
              className="absolute bottom-0 left-0 p-4 md:p-8 z-[110]"
            >
              <motion.img
                src={CAT_GIF_URL}
                alt="Hero Cat"
                animate={{ y: [0, -20, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="w-48 h-48 md:w-80 md:h-80 object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 100, y: 100 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 2, delay: 0.8, ease: "easeOut" }}
              className="absolute bottom-0 right-0 p-4 md:p-8 z-[110]"
            >
              <motion.img
                src={WINDAH_GIF_URL}
                alt="Hero Windah"
                animate={{ y: [0, -15, 0] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", delay: 0.2 }}
                className="w-48 h-48 md:w-80 md:h-80 object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]"
              />
            </motion.div>

          </div>
        )}
      </AnimatePresence>
    </>
  )
}
