import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Copy, Check, Mail, Crown, Link as LinkIcon, Eye, Edit3, X } from 'lucide-react'

const mockCollaborators = [
  { id: 1, name: 'Ahmet Y.', email: 'ahmet@mail.com', avatar: 'AY', color: 'from-cyan-500 to-blue-500' },
  { id: 2, name: 'Elif K.', email: 'elif@mail.com', avatar: 'EK', color: 'from-emerald-500 to-teal-500' },
  { id: 3, name: 'Murat D.', email: 'murat@mail.com', avatar: 'MD', color: 'from-amber-500 to-orange-500' },
]

export default function CollaborationBadge({ cvId, cvName, isOpen, onToggle, position = 'right' }) {
  const [copied, setCopied] = useState(false)
  const [permission, setPermission] = useState('edit')
  const [email, setEmail] = useState('')
  const [inviteSent, setInviteSent] = useState(false)

  const collabLink = `${window.location.origin}/collab/${cvId}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(collabLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = collabLink
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleInvite = () => {
    if (!email.trim()) return
    setInviteSent(true)
    setTimeout(() => {
      setInviteSent(false)
      setEmail('')
    }, 2000)
  }

  return (
    <div className="relative">
      {/* Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onToggle}
        className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl
                   bg-gradient-to-r from-cyan-500/10 to-emerald-500/10
                   border border-cyan-500/20 hover:border-cyan-500/40
                   text-cyan-400 hover:text-cyan-300
                   transition-colors duration-300 group"
      >
        <Users className="w-5 h-5" />
        {/* Glow ring on hover */}
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100
                        transition-opacity duration-500
                        shadow-[0_0_20px_rgba(6,182,212,0.15)]
                        pointer-events-none" />
      </motion.button>

      {/* Popover */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onToggle}
              className="fixed inset-0 z-[140]"
            />

            {/* Popover Panel */}
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ type: 'spring', damping: 24, stiffness: 380 }}
              className={`absolute ${position === 'left' ? 'left-0' : 'right-0'} top-full mt-3 z-[150] w-[380px] sm:w-[380px] max-w-[90vw]
                         rounded-2xl overflow-hidden
                         bg-slate-900 shadow-[0_24px_80px_rgba(0,0,0,0.8),0_0_40px_rgba(6,182,212,0.15)]
                         border border-slate-700/50`}
            >
              {/* Header */}
              <div className="relative px-5 pt-5 pb-4 border-b border-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20
                                    border border-cyan-500/20 flex items-center justify-center">
                      <Users className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">İşbirliği</h3>
                      <p className="text-[11px] text-slate-500 mt-0.5 truncate max-w-[200px]">
                        {cvName}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onToggle}
                    className="w-7 h-7 rounded-lg flex items-center justify-center
                               text-slate-500 hover:text-white hover:bg-white/5
                               transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* PRO Feature Banner */}
                <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl
                                bg-gradient-to-r from-amber-500/5 to-orange-500/5
                                border border-amber-500/10">
                  <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <p className="text-[11px] text-amber-400/80">
                    Bu özellik <span className="font-bold text-amber-400">PRO</span> üyelere özeldir
                  </p>
                </div>
              </div>

              {/* Link Section */}
              <div className="px-5 py-4 border-b border-white/5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">
                  Paylaşım Bağlantısı
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl
                                  bg-white/[0.03] border border-white/5 overflow-hidden">
                    <LinkIcon className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="text-xs text-slate-400 truncate select-all">
                      {collabLink}
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCopy}
                    className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center
                               border transition-all duration-300
                               ${copied
                                 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                 : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                               }`}
                  >
                    <AnimatePresence mode="wait">
                      {copied ? (
                        <motion.div
                          key="check"
                          initial={{ scale: 0, rotate: -90 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: 90 }}
                        >
                          <Check className="w-4 h-4" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="copy"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <Copy className="w-4 h-4" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>
              </div>

              {/* Permission Toggles */}
              <div className="px-5 py-4 border-b border-white/5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 block">
                  Erişim İzni
                </label>
                <div className="flex gap-2">
                  {/* Edit Permission */}
                  <button
                    onClick={() => setPermission('edit')}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl
                               border text-xs font-medium transition-all duration-300
                               ${permission === 'edit'
                                 ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.1)]'
                                 : 'bg-white/[0.02] border-white/5 text-slate-500 hover:text-slate-300 hover:border-white/10'
                               }`}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Düzenleme izni ver
                  </button>

                  {/* View Only */}
                  <button
                    onClick={() => setPermission('view')}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl
                               border text-xs font-medium transition-all duration-300
                               ${permission === 'view'
                                 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.1)]'
                                 : 'bg-white/[0.02] border-white/5 text-slate-500 hover:text-slate-300 hover:border-white/10'
                               }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Sadece görüntüleme
                  </button>
                </div>
              </div>

              {/* Email Invite */}
              <div className="px-5 py-4 border-b border-white/5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">
                  E-posta ile Davet Et
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl
                                  bg-white/[0.03] border border-white/5
                                  focus-within:border-cyan-500/30 transition-colors">
                    <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
                      placeholder="ornek@mail.com"
                      className="flex-1 bg-transparent text-xs text-white placeholder-slate-600
                                 outline-none"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleInvite}
                    disabled={!email.trim()}
                    className="shrink-0 px-4 py-2.5 rounded-xl text-xs font-semibold
                               bg-gradient-to-r from-cyan-500 to-emerald-500
                               text-white shadow-lg shadow-cyan-500/20
                               hover:shadow-cyan-500/30 hover:brightness-110
                               disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none
                               transition-all duration-300"
                  >
                    {inviteSent ? (
                      <span className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5" />
                        Gönderildi
                      </span>
                    ) : (
                      'Davet Gönder'
                    )}
                  </motion.button>
                </div>
              </div>

              {/* Collaborators List */}
              <div className="px-5 py-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                    Davet Edilenler
                  </label>
                  <span className="text-[10px] text-slate-600 font-medium">
                    {mockCollaborators.length} kişi
                  </span>
                </div>

                <div className="space-y-2">
                  {mockCollaborators.map((collab, index) => (
                    <motion.div
                      key={collab.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.08, duration: 0.3 }}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl
                                 bg-white/[0.02] border border-white/5
                                 hover:bg-white/[0.04] hover:border-white/10
                                 transition-colors group"
                    >
                      {/* Avatar */}
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${collab.color}
                                      flex items-center justify-center shrink-0
                                      shadow-lg`}>
                        <span className="text-[10px] font-bold text-white">
                          {collab.avatar}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-white truncate">
                          {collab.name}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {collab.email}
                        </p>
                      </div>

                      {/* Status Pill */}
                      <span className="shrink-0 px-2 py-1 rounded-md
                                       bg-emerald-500/10 border border-emerald-500/20
                                       text-[10px] font-medium text-emerald-400">
                        Davet edildi
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Stacked Avatars Summary */}
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {mockCollaborators.map((collab) => (
                      <div
                        key={collab.id}
                        className={`w-7 h-7 rounded-full bg-gradient-to-br ${collab.color}
                                    flex items-center justify-center
                                    border-2 border-[#0f1115]
                                    shadow-md`}
                      >
                        <span className="text-[9px] font-bold text-white">
                          {collab.avatar}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    <span className="text-slate-300 font-medium">{mockCollaborators.length} kişi</span> bu CV'ye erişebilir
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
