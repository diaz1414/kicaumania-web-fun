import { motion, AnimatePresence } from 'framer-motion'
import { Share2, X as CloseIcon, Link, MoreHorizontal } from 'lucide-react'
import { siInstagram, siX, siWhatsapp } from 'simple-icons'

interface ShareDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export const ShareDrawer = ({ isOpen, onClose }: ShareDrawerProps) => {
  const shareUrl = "https://kicaumania.diaww.my.id/"
  const shareText = "Ikuti #KicauManiaChallenge! Ritual Kucing Gacor sedang viral di TikTok! 🦜🐱🔥"

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
      action: () => {
        navigator.clipboard.writeText(shareUrl)
        alert('Link disalin ke clipboard! 🚀')
      }
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
                onClick={() => {
                   navigator.clipboard.writeText(shareUrl)
                   alert('Link disalin! 🚀')
                }}
                className="px-4 py-2 bg-pink-600 text-white text-xs font-black rounded-lg hover:bg-pink-700 transition-colors uppercase"
               >
                 Salin
               </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
