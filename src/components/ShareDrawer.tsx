import { motion, AnimatePresence } from 'framer-motion'
import { Share2, X as CloseIcon, Link, MoreHorizontal, Check } from 'lucide-react'
import { siInstagram, siX, siWhatsapp } from 'simple-icons'
import { useState } from 'react'

interface ShareDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export const ShareDrawer = ({ isOpen, onClose }: ShareDrawerProps) => {
  const [showCopyAlert, setShowCopyAlert] = useState(false)
  const shareUrl = "https://kicaumania.diaww.my.id/"
  const shareText = "Ikuti #KicauManiaChallenge! Ritual Kucing Gacor sedang viral di TikTok! 🦜🐱🔥"

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl)
    setShowCopyAlert(true)
    setTimeout(() => setShowCopyAlert(false), 2000)
  }

  const socialLinks = [
    { 
      name: 'WhatsApp', 
      icon: (
        <svg role="img" viewBox="0 0 24 24" className="w-6 h-6 fill-green-500">
          <path d={siWhatsapp.path} />
        </svg>
      ), 
      url: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}` 
    },
    { 
      name: 'Instagram', 
      icon: (
        <svg role="img" viewBox="0 0 24 24" className="w-6 h-6 fill-pink-500">
          <path d={siInstagram.path} />
        </svg>
      ), 
      url: `https://www.instagram.com/` 
    },
    { 
      name: 'X (Twitter)', 
      icon: (
        <svg role="img" viewBox="0 0 24 24" className="w-6 h-6 fill-white">
          <path d={siX.path} />
        </svg>
      ), 
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}` 
    },
    { 
      name: 'Salin Link', 
      icon: <Link className="w-6 h-6 text-slate-400" />, 
      action: handleCopy
    },
    { 
      name: 'Lainnya', 
      icon: <MoreHorizontal className="w-6 h-6 text-slate-400" />, 
      action: () => {
        if (navigator.share) {
          navigator.share({
            title: 'Kicau Mania Hub',
            text: shareText,
            url: shareUrl,
          })
        } else {
          alert('Gunakan fitur share browser Anda!')
        }
      }
    }
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 rounded-t-[32px] z-[101] px-6 pt-4 pb-12 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
          >
            {/* Handle */}
            <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto mb-8" />

            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-pink-600 rounded-xl">
                  <Share2 className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight text-white">Bagikan Tren Ini</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors"
              >
                <CloseIcon className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-5 gap-4">
              {socialLinks.map((social) => (
                <button
                  key={social.name}
                  onClick={() => {
                    if (social.action) social.action()
                    else if (social.url) window.open(social.url, '_blank')
                    // onClose() // Keep open or close? Usually keep open for a moment or close.
                  }}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-slate-800 rounded-2xl flex items-center justify-center group-hover:bg-slate-700 group-hover:scale-110 transition-all duration-300 border border-slate-700/50">
                    {social.icon}
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-tighter">
                    {social.name}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-10 p-4 bg-slate-800/50 rounded-2xl border border-slate-700/30 flex items-center justify-between gap-4">
               <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Share URL</span>
                  <span className="text-sm font-medium text-slate-300 truncate max-w-[200px]">{shareUrl}</span>
               </div>
               <button 
                onClick={handleCopy}
                className="px-4 py-2 bg-pink-600 text-white text-xs font-black rounded-lg hover:bg-pink-700 transition-colors uppercase"
               >
                 Salin
               </button>
            </div>
          </motion.div>

          {/* Custom Copy Alert */}
          <AnimatePresence>
            {showCopyAlert && (
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[200] flex flex-col items-center gap-3 px-6 py-4 bg-yellow-400 rounded-3xl shadow-[0_20px_50px_rgba(250,204,21,0.4)] border-4 border-black"
              >
                <motion.img 
                  src="/cat.gif" 
                  alt="Gacor Cat" 
                  className="w-16 h-16 rounded-xl border-2 border-black"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 0.5 }}
                />
                <div className="flex flex-col items-center">
                  <span className="text-black font-black uppercase text-lg italic leading-tight">LINK DISALIN!</span>
                  <span className="text-black font-bold uppercase text-[10px] tracking-[0.2em]">KUCING ANDA GACOR 🐈🔥</span>
                </div>
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-green-500 rounded-full border-2 border-black flex items-center justify-center">
                   <Check className="w-4 h-4 text-white stroke-[4px]" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  )
}
