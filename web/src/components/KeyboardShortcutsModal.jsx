import { motion, AnimatePresence } from 'framer-motion'
import { X, Keyboard } from 'lucide-react'

const shortcutGroups = [
  {
    label: 'Düzenleme',
    shortcuts: [
      { keys: ['Ctrl', 'Z'], description: 'Geri Al' },
      { keys: ['Ctrl', 'Y'], description: 'İleri Al' },
    ],
  },
  {
    label: 'Dışa Aktarma',
    shortcuts: [
      { keys: ['Ctrl', 'S'], description: 'Kaydet' },
      { keys: ['Ctrl', 'P'], description: 'PDF İndir' },
    ],
  },
  {
    label: 'Navigasyon',
    shortcuts: [
      { keys: ['Ctrl', '/'], description: 'Bu paneli aç/kapa' },
      { keys: ['Ctrl', 'Shift', 'T'], description: 'Şablon değiştir' },
      { keys: ['Ctrl', 'Shift', 'A'], description: 'AI Asistanı' },
      { keys: ['Ctrl', 'Shift', 'F'], description: 'AI ile Doldur' },
      { keys: ['Esc'], description: 'Modalları kapat' },
    ],
  },
]

function KeyBadge({ children }) {
  return (
    <span className="inline-flex items-center justify-center min-w-[28px] rounded-lg bg-white/10 border border-white/20 px-2 py-1 font-mono text-xs text-slate-200 shadow-[0_2px_0_0_rgba(255,255,255,0.06)] select-none">
      {children}
    </span>
  )
}

function ShortcutRow({ keys, description }) {
  return (
    <div className="flex items-center justify-between py-2.5 px-1 group">
      <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
        {description}
      </span>
      <div className="flex items-center gap-1.5 ml-4 shrink-0">
        {keys.map((key, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <span className="text-[10px] text-slate-600">+</span>}
            <KeyBadge>{key}</KeyBadge>
          </span>
        ))}
      </div>
    </div>
  )
}

export default function KeyboardShortcutsModal({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-md rounded-2xl bg-[#0f1115] border border-white/10 shadow-2xl shadow-black/50 overflow-hidden"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-cyan-500/10">
                  <Keyboard className="w-4 h-4 text-cyan-400" />
                </div>
                <h2 className="text-base font-semibold text-white">
                  Klavye Kısayolları
                </h2>
              </div>
              <button
                onClick={onClose}
                className="flex items-center justify-center w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-4 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
              {shortcutGroups.map((group, gi) => (
                <div key={group.label} className={gi > 0 ? 'mt-5' : ''}>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
                    {group.label}
                  </p>
                  <div className="divide-y divide-white/5">
                    {group.shortcuts.map((shortcut) => (
                      <ShortcutRow
                        key={shortcut.description}
                        keys={shortcut.keys}
                        description={shortcut.description}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer hint */}
            <div className="px-6 py-3 border-t border-white/5">
              <p className="text-[11px] text-slate-600 text-center">
                Kapatmak için{' '}
                <span className="inline-flex items-center justify-center rounded-md bg-white/5 border border-white/10 px-1.5 py-0.5 font-mono text-[10px] text-slate-400">
                  Esc
                </span>{' '}
                tuşuna basın
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
