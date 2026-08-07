import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Sparkles, X, Wand2, CheckCircle2, Briefcase, Brain, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

const PROFESSION_TEMPLATES = {
  'frontend geliştirici': {
    summary:
      'Modern web teknolojileri konusunda uzmanlaşmış, kullanıcı deneyimi odaklı Frontend Geliştirici. Responsive tasarım, performans optimizasyonu ve erişilebilirlik konularında derin bilgiye sahip. Agile metodolojilerle çalışma deneyimi bulunan, sürekli öğrenmeye açık bir profesyonel.',
    skills: [
      'React',
      'TypeScript',
      'Next.js',
      'Tailwind CSS',
      'JavaScript (ES6+)',
      'Redux / Zustand',
      'HTML5 & CSS3',
      'Git & GitHub',
      'REST API Entegrasyonu',
      'Responsive Tasarım',
    ],
    experienceDescription:
      'Kullanıcı arayüzü geliştirme, komponent mimarisi tasarımı, performans optimizasyonu ve cross-browser uyumluluk sağlama konularında aktif rol aldım. CI/CD süreçlerine katkıda bulunarak ekip verimliliğini artırdım.',
  },
  'backend geliştirici': {
    summary:
      'Ölçeklenebilir ve güvenli sunucu taraflı uygulamalar geliştiren Backend Geliştirici. Mikroservis mimarisi, veritabanı optimizasyonu ve API tasarımı konularında güçlü deneyime sahip. Yüksek trafikli sistemlerde performans ve güvenilirlik sağlama konusunda uzman.',
    skills: [
      'Node.js',
      'Python',
      'PostgreSQL',
      'MongoDB',
      'Docker',
      'REST & GraphQL API',
      'Redis',
      'AWS / Azure',
      'Mikroservis Mimarisi',
      'CI/CD Pipeline',
    ],
    experienceDescription:
      'Sunucu taraflı uygulama geliştirme, veritabanı tasarımı ve optimizasyonu, API geliştirme ve mikroservis mimarisine geçiş projelerinde aktif rol aldım. Sistem güvenliği ve performans iyileştirmeleri gerçekleştirdim.',
  },
  'veri bilimci': {
    summary:
      'Büyük veri setlerinden anlamlı içgörüler çıkaran, makine öğrenmesi modelleri geliştiren Veri Bilimci. İstatistiksel analiz, tahminleme ve doğal dil işleme konularında deneyimli. Veri odaklı karar alma süreçlerine katkı sağlayan analitik düşünür.',
    skills: [
      'Python',
      'TensorFlow / PyTorch',
      'Pandas & NumPy',
      'Scikit-learn',
      'SQL',
      'Veri Görselleştirme (Matplotlib, Seaborn)',
      'Doğal Dil İşleme (NLP)',
      'Büyük Veri (Spark)',
      'İstatistiksel Modelleme',
      'Jupyter Notebook',
    ],
    experienceDescription:
      'Veri analizi, makine öğrenmesi modeli geliştirme, A/B testleri ve tahminleme projeleri yürüttüm. Veri pipeline\'ları oluşturarak iş birimlerine raporlama ve içgörü sağladım.',
  },
  'grafik tasarımcı': {
    summary:
      'Yaratıcı ve detay odaklı Grafik Tasarımcı. Marka kimliği, dijital ve basılı medya tasarımı konularında geniş portföye sahip. Kullanıcı merkezli tasarım prensipleriyle görsel iletişimi güçlendiren çözümler üreten bir profesyonel.',
    skills: [
      'Adobe Photoshop',
      'Adobe Illustrator',
      'Figma',
      'Adobe InDesign',
      'UI/UX Tasarım',
      'Marka Kimliği Tasarımı',
      'Tipografi',
      'Motion Graphics (After Effects)',
      'Renk Teorisi',
      'Prototyping',
    ],
    experienceDescription:
      'Marka kimliği oluşturma, sosyal medya görselleri, web arayüz tasarımı ve baskı materyalleri hazırladım. Müşteri briefinglerine uygun yaratıcı çözümler geliştirerek marka bilinirliğini artırdım.',
  },
  'proje yöneticisi': {
    summary:
      'Çok disiplinli ekipleri yöneten, proje teslimatlarını zamanında ve bütçe dahilinde gerçekleştiren Proje Yöneticisi. Agile ve Waterfall metodolojilerinde deneyimli. Paydaş yönetimi, risk analizi ve süreç iyileştirme konularında güçlü yetkinliklere sahip.',
    skills: [
      'Agile & Scrum',
      'Jira & Confluence',
      'Risk Yönetimi',
      'Bütçe Planlama',
      'Paydaş Yönetimi',
      'MS Project',
      'Kanban',
      'İletişim & Liderlik',
      'Süreç İyileştirme',
      'OKR & KPI Takibi',
    ],
    experienceDescription:
      'Proje planlama, kaynak yönetimi, sprint planlama ve retrospektif toplantıları yönettim. Ekipler arası koordinasyonu sağlayarak proje başarı oranını artırdım ve süreç iyileştirmeleri gerçekleştirdim.',
  },
}

const DEFAULT_TEMPLATE = {
  summary:
    'Alanında deneyimli, sonuç odaklı ve sürekli gelişime açık bir profesyonel. Ekip çalışmasına yatkın, analitik düşünme ve problem çözme becerilerine sahip. Dinamik iş ortamlarında etkili performans sergileyen, iletişim becerileri güçlü bir takım oyuncusu.',
  skills: [
    'Proje Yönetimi',
    'Takım Çalışması',
    'Problem Çözme',
    'İletişim Becerileri',
    'Microsoft Office',
    'Zaman Yönetimi',
    'Analitik Düşünme',
    'Sunum Becerileri',
    'Müşteri İlişkileri',
    'Stratejik Planlama',
  ],
  experienceDescription:
    'Sorumluluk alanımdaki projelerde aktif rol alarak ekip hedeflerine ulaşılmasına katkı sağladım. Süreç iyileştirme önerileri geliştirerek operasyonel verimliliği artırdım.',
}

const FILL_STEPS = [
  { key: 'summary', label: 'Profesyonel Özet', icon: Brain },
  { key: 'skills', label: 'Beceriler (8-10 yetkinlik)', icon: Sparkles },
  { key: 'experience', label: 'Deneyim açıklamaları', icon: Briefcase },
]

function getTemplate(jobTitle) {
  const normalized = jobTitle.trim().toLowerCase()
  return PROFESSION_TEMPLATES[normalized] || DEFAULT_TEMPLATE
}

/* ────────── sparkle particles ────────── */
function SparkleParticles() {
  const particles = Array.from({ length: 18 }, (_, i) => {
    const angle = (i / 18) * 360
    const radius = 60 + Math.random() * 80
    const x = Math.cos((angle * Math.PI) / 180) * radius
    const y = Math.sin((angle * Math.PI) / 180) * radius
    const size = 3 + Math.random() * 5
    const delay = Math.random() * 0.3
    return { id: i, x, y, size, delay }
  })

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            background: `hsl(${200 + p.id * 9}, 90%, 65%)`,
          }}
          initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          animate={{ opacity: 0, x: p.x, y: p.y, scale: 0 }}
          transition={{ duration: 0.9, delay: p.delay, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}

/* ────────── typewriter line ────────── */
function TypewriterLine({ text, delay = 0 }) {
  const [displayed, setDisplayed] = useState('')

  useState(() => {
    let i = 0
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        i++
        setDisplayed(text.slice(0, i))
        if (i >= text.length) clearInterval(interval)
      }, 18)
    }, delay)
    return () => clearTimeout(timeout)
  })

  return (
    <span className="font-mono text-sm text-slate-300">
      {displayed}
      {displayed.length < text.length && (
        <motion.span
          className="ml-px inline-block h-4 w-[2px] bg-cyan-400"
          animate={{ opacity: [1, 0] }}
          transition={{ repeat: Infinity, duration: 0.5 }}
        />
      )}
    </span>
  )
}

/* ══════════ MAIN COMPONENT ══════════ */
export default function AISmartFillModal({ isOpen, onClose, cvData, onFill }) {
  const [jobTitle, setJobTitle] = useState('')
  const [phase, setPhase] = useState('idle') // idle | generating | success
  const [progress, setProgress] = useState(0)
  const [activeStep, setActiveStep] = useState(-1)
  const [previewText, setPreviewText] = useState('')

  /* ── reset on close ── */
  function handleClose() {
    setJobTitle('')
    setPhase('idle')
    setProgress(0)
    setActiveStep(-1)
    setPreviewText('')
    onClose()
  }

  /* ── generate ── */
  function handleGenerate() {
    if (!jobTitle.trim()) return
    const template = getTemplate(jobTitle)
    setPhase('generating')
    setProgress(0)
    setActiveStep(0)
    setPreviewText('')

    /* simulate progress */
    const totalDuration = 3200
    const stepDuration = totalDuration / FILL_STEPS.length
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 1
      })
    }, totalDuration / 100)

    /* step-by-step animation */
    FILL_STEPS.forEach((_, idx) => {
      setTimeout(() => {
        setActiveStep(idx)
        if (idx === 0) setPreviewText(template.summary.slice(0, 90) + '…')
        if (idx === 1) setPreviewText(template.skills.slice(0, 5).join(', ') + '…')
        if (idx === 2) setPreviewText(template.experienceDescription.slice(0, 90) + '…')
      }, stepDuration * idx + 200)
    })

    /* finish */
    setTimeout(() => {
      clearInterval(progressInterval)
      setProgress(100)
      setPhase('success')

      const filledData = {
        ...cvData,
        summary: template.summary,
        skills: template.skills,
        experienceDescription: template.experienceDescription,
      }
      onFill(filledData)
      toast.success("Özgeçmişin yapay zeka ile başarıyla dolduruldu!")
    }, totalDuration + 400)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* card */}
          <motion.div
            className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-[2rem] border border-white/10 bg-slate-950/95 backdrop-blur-3xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] ring-1 ring-white/5"
            initial={{ scale: 0.92, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 30 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          >
            {/* gradient accent bar */}
            <div className="h-1 w-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500" />

            {/* close button */}
            <button
              onClick={handleClose}
              className="absolute right-3 top-4 rounded-lg p-1.5 text-slate-500 transition hover:bg-white/5 hover:text-white"
            >
              <X size={18} />
            </button>

            {/* body */}
            <div className="p-6">
              {/* ─── IDLE ─── */}
              {phase === 'idle' && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {/* header */}
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500">
                      <Wand2 size={20} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">AI ile CV Doldur</h2>
                      <p className="text-xs text-slate-500">
                        Mesleğinizi girin, gerisini biz halledelim
                      </p>
                    </div>
                  </div>

                  {/* input */}
                  <div className="group relative mb-5">
                    <Briefcase
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 transition group-focus-within:text-cyan-400"
                    />
                    <input
                      type="text"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                      placeholder="Örn: Frontend Geliştirici, Veri Bilimci…"
                      className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-600 outline-none transition focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30"
                    />
                  </div>

                  {/* what will be filled */}
                  <div className="mb-5 rounded-xl border border-white/5 bg-white/[0.02] p-4">
                    <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-slate-500">
                      Doldurulacak Alanlar
                    </p>
                    <div className="space-y-2.5">
                      {FILL_STEPS.map((step) => (
                        <div key={step.key} className="flex items-center gap-2.5">
                          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/5">
                            <step.icon size={13} className="text-violet-400" />
                          </div>
                          <span className="text-sm text-slate-400">{step.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* action button */}
                  <motion.button
                    onClick={handleGenerate}
                    disabled={!jobTitle.trim()}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Sparkles size={16} />
                    AI ile Doldur
                  </motion.button>
                </motion.div>
              )}

              {/* ─── GENERATING ─── */}
              {phase === 'generating' && (
                <motion.div
                  key="generating"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {/* header */}
                  <div className="mb-6 flex items-center gap-3">
                    <motion.div
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500"
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                    >
                      <Brain size={20} className="text-white" />
                    </motion.div>
                    <div>
                      <h2 className="text-lg font-bold text-white">AI Oluşturuyor…</h2>
                      <p className="text-xs text-slate-500">
                        <span className="text-cyan-400">{jobTitle}</span> için içerik hazırlanıyor
                      </p>
                    </div>
                  </div>

                  {/* progress bar */}
                  <div className="mb-5">
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                        İlerleme
                      </span>
                      <span className="text-xs font-medium text-cyan-400">{progress}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500"
                        initial={{ width: '0%' }}
                        animate={{ width: `${progress}%` }}
                        transition={{ ease: 'linear', duration: 0.15 }}
                      />
                    </div>
                  </div>

                  {/* steps */}
                  <div className="mb-5 space-y-2.5">
                    {FILL_STEPS.map((step, idx) => {
                      const done = idx < activeStep
                      const active = idx === activeStep
                      return (
                        <motion.div
                          key={step.key}
                          className={`flex items-center gap-3 rounded-xl border px-3.5 py-2.5 transition ${
                            active
                              ? 'border-violet-500/30 bg-violet-500/5'
                              : done
                                ? 'border-emerald-500/20 bg-emerald-500/5'
                                : 'border-white/5 bg-white/[0.02]'
                          }`}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                        >
                          {done ? (
                            <CheckCircle2 size={16} className="text-emerald-400" />
                          ) : active ? (
                            <Loader2 size={16} className="animate-spin text-violet-400" />
                          ) : (
                            <step.icon size={16} className="text-slate-600" />
                          )}
                          <span
                            className={`text-sm ${
                              active
                                ? 'font-medium text-white'
                                : done
                                  ? 'text-emerald-300'
                                  : 'text-slate-600'
                            }`}
                          >
                            {step.label}
                          </span>
                        </motion.div>
                      )
                    })}
                  </div>

                  {/* typewriter preview */}
                  {previewText && (
                    <motion.div
                      className="rounded-xl border border-white/5 bg-white/[0.02] p-3"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                    >
                      <TypewriterLine text={previewText} />
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* ─── SUCCESS ─── */}
              {phase === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative text-center"
                >
                  <SparkleParticles />

                  <motion.div
                    className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.1 }}
                  >
                    <CheckCircle2 size={32} className="text-white" />
                  </motion.div>

                  <h2 className="mb-1 text-xl font-bold text-white">Tamamlandı!</h2>
                  <p className="mb-5 text-sm text-slate-400">
                    CV&apos;niz <span className="text-cyan-400">{jobTitle}</span> pozisyonuna göre
                    dolduruldu
                  </p>

                  {/* filled items summary */}
                  <div className="mb-5 space-y-2">
                    {FILL_STEPS.map((step, idx) => (
                      <motion.div
                        key={step.key}
                        className="flex items-center gap-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3.5 py-2"
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + idx * 0.1 }}
                      >
                        <CheckCircle2 size={15} className="text-emerald-400" />
                        <span className="text-sm text-emerald-300">{step.label}</span>
                      </motion.div>
                    ))}
                  </div>

                  <motion.button
                    onClick={handleClose}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition"
                  >
                    Harika, Kapat
                  </motion.button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
