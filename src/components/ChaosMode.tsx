import { useEffect, useRef, useState } from 'react'
import * as tf from '@tensorflow/tfjs'
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection'
import '@tensorflow/tfjs-backend-webgl'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../store'

export function ChaosMode() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [modelLoading, setModelLoading] = useState(true)
  const setChaosMode = useAppStore(state => state.setChaosMode)
  const isChaosMode = useAppStore(state => state.isChaosMode)
  const isCameraActive = useAppStore(state => state.isCameraActive)

  const lastHandsRef = useRef<{ h1: { x: number, y: number }[], h2: { x: number, y: number }[] }>({ h1: [], h2: [] })

  useEffect(() => {
    if (!isCameraActive) return

    let detector: handPoseDetection.HandDetector | null = null
    let animationFrameId: number

    const initialize = async () => {
      try {
        await tf.ready()
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await new Promise((resolve) => {
            if (videoRef.current) {
              videoRef.current.onloadeddata = () => {
                videoRef.current!.play()
                resolve(true)
              }
            }
          })
        }

        // Menggunakan Global Hand Pose Detection (sama seperti mesin di Python)
        const hp = (window as any).handPoseDetection
        if (!hp) throw new Error("MediaPipe script not loaded yet")

        const model = hp.SupportedModels.MediaPipeHands
        const detectorConfig = {
          runtime: 'mediapipe',
          solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/hands`,
          modelType: 'full'
        }
        detector = await hp.createDetector(model, detectorConfig)
        setModelLoading(false)

        detectLoop()
      } catch (err) {
        console.error("Error initializing Chaos Mode:", err)
      }
    }

    const detectLoop = async () => {
      if (!detector || !videoRef.current) return

      try {
        const hands = await detector.estimateHands(videoRef.current)

        // Titik hijau dihilangkan sesuai permintaan user
        const ctx = canvasRef.current?.getContext('2d')
        if (ctx && canvasRef.current && videoRef.current) {
          canvasRef.current.width = videoRef.current.videoWidth
          canvasRef.current.height = videoRef.current.videoHeight
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
          // Pengecekan tetap jalan di background, tapi tidak digambar
        }

        if (hands.length >= 2) {
          // Stabilisasi: Memastikan Tangan 1 tetap Tangan 1 (tidak tertukar dengan Tangan 2 tiap frame)
          // Menggunakan Titik Tengah Telapak Tangan (Rata-rata 3 titik) agar deteksi stabil dari segala sudut (depan/belakang/samping)
          const getPalmCenter = (hand: any) => {
            const kp = hand.keypoints
            // Rata-rata dari Pergelangan (0), Pangkal Telunjuk (5), dan Pangkal Kelingking (17)
            const p0 = kp[0], p5 = kp[5], p17 = kp[17]
            return {
              x: (p0.x + p5.x + p17.x) / 3,
              y: (p0.y + p5.y + p17.y) / 3
            }
          }
          const currentH1 = getPalmCenter(hands[0])
          const currentH2 = getPalmCenter(hands[1])

          if (!lastHandsRef.current || !Array.isArray(lastHandsRef.current.h1)) {
            lastHandsRef.current = { h1: [], h2: [] }
          }

          const histories = lastHandsRef.current
          const prevH1 = histories.h1[histories.h1.length - 1]

          let h1, h2;
          if (prevH1) {
            // Cari mana yang lebih dekat dengan posisi Tangan 1 sebelumnya
            const d1 = Math.sqrt(Math.pow(currentH1.x - prevH1.x, 2) + Math.pow(currentH1.y - prevH1.y, 2))
            const d2 = Math.sqrt(Math.pow(currentH2.x - prevH1.x, 2) + Math.pow(currentH2.y - prevH1.y, 2))

            if (d1 < d2) {
              h1 = currentH1; h2 = currentH2;
            } else {
              h1 = currentH2; h2 = currentH1;
            }
          } else {
            h1 = currentH1; h2 = currentH2;
          }

          histories.h1.push({ x: h1.x, y: h1.y })
          histories.h2.push({ x: h2.x, y: h2.y })

          if (histories.h1.length > 15) {
            histories.h1.shift()
            histories.h2.shift()
          }

          if (histories.h1.length >= 5) {
            const getMove = (h: { x: number, y: number }[]) => {
              let m = 0
              for (let i = 1; i < h.length; i++) {
                const d = Math.sqrt(Math.pow(h[i].x - h[i - 1].x, 2) + Math.pow(h[i].y - h[i - 1].y, 2))
                if (!isNaN(d)) m += d
              }
              return m
            }

            const m1 = getMove(histories.h1)
            const m2 = getMove(histories.h2)

            // Sekali sudah nyala, biarkan nyala terus sampai user pencet STOP
            if (m1 > 80 || m2 > 80) {
              setChaosMode(true)
            }
          }
        }
      } catch (err) {
        console.log("Detection error", err)
      }

      animationFrameId = requestAnimationFrame(detectLoop)
    }

    initialize()

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach(t => t.stop())
      }
    }
  }, [isCameraActive, setChaosMode])

  if (!isCameraActive) return null

  return (
    <div className="fixed inset-0 z-40 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-4 md:p-8">
      <div className="relative w-full max-w-3xl aspect-[3/4] md:aspect-video rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(250,204,21,0.15)] border-4 border-slate-800 bg-black flex flex-col transition-all duration-500">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          muted
          style={{ transform: 'scaleX(-1)' }} // Mirror the camera for natural feel
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{ transform: 'scaleX(-1)' }}
        />

        {!isChaosMode && (
          <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center justify-center px-4 z-50">
            {modelLoading ? (
              <div className="px-6 py-3 bg-black/80 backdrop-blur-md rounded-full text-white text-base md:text-xl font-bold animate-pulse border-2 border-white/20 text-center max-w-full">
                Menyiapkan Kucing... 🐈
              </div>
            ) : (
              <div className="px-6 py-3 bg-yellow-400/90 backdrop-blur-md rounded-full text-black text-lg md:text-2xl font-black shadow-[0_0_40px_rgba(250,204,21,0.6)] animate-bounce border-2 border-black text-center max-w-full">
                GERAKKAN TANGANMU SEKARANG!! 🌪️
              </div>
            )}

          </div>
        )}
      </div>

      <AnimatePresence>
        {isChaosMode && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mt-8 z-50 pointer-events-none"
          >
            <motion.h1
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 0.5 }}
              className="text-4xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 to-red-600 drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)] uppercase italic transform -skew-x-12 text-center"
            >
              KICAU MANIA!
            </motion.h1>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tombol Berhenti saat Chaos Mode */}
      {isChaosMode && (
        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-8 py-3 bg-red-600/80 backdrop-blur-sm hover:bg-red-700 text-white rounded-full font-bold shadow-xl border-2 border-white/20 transition-all z-50"
        >
          BERHENTI RITUAL
        </button>
      )}
    </div>
  )
}
