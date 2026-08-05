import { Link } from 'react-router-dom'
import { Crown, Search, LayoutGrid, Briefcase, Sparkles, Code, GraduationCap, Trophy, HeartPulse, Building2, User, Globe, Image as ImageIcon, CheckCircle, ArrowRight, Star, Filter } from 'lucide-react'
import React, { useState, useEffect, useMemo, useRef } from 'react'
import { templateAPI } from '../services/api'

// Scroll Animation Hook
function useScrollAnimation() {
    const ref = useRef(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                }
            },
            { threshold: 0.1, rootMargin: '50px' }
        )
        if (ref.current) observer.observe(ref.current)
        return () => observer.disconnect()
    }, [])

    return [ref, isVisible]
}

// Animated Section Wrapper
function AnimatedSection({ children, className = '', delay = 0 }) {
    const [ref, isVisible] = useScrollAnimation()

    return (
        <div
            ref={ref}
            className={`transition-all duration-700 ${className}`}
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
                transitionDelay: `${delay}ms`
            }}
        >
            {children}
        </div>
    )
}

const templates = [
    { id: 'modern', name: 'Modern', description: 'Renkli ve dinamik', isPremium: false, color: 'from-cyan-500 to-blue-600', image: '/images/resume689896.png', category: 'Genel' },
    { id: 'minimalist', name: 'Minimalist', description: 'Sade ve profesyonel', isPremium: true, color: 'from-gray-600 to-gray-800', image: '/images/resume656564.png', category: 'Genel' },
    { id: 'corporate', name: 'Kurumsal', description: 'Ciddi ve güven veren', isPremium: true, color: 'from-indigo-600 to-purple-700', image: '/images/resume565656.png', category: 'Kurumsal' },
    { id: 'creative', name: 'Yaratıcı', description: 'Tasarımcılar için', isPremium: true, color: 'from-pink-500 to-orange-400', image: '/images/resume457874.png', category: 'Yaratıcı' },
    { id: 'tech', name: 'Teknoloji', description: 'Yazılımcılar için', isPremium: true, color: 'from-slate-800 to-slate-900', image: '/images/resume65677.png', category: 'Teknoloji' },
    { id: 'executive', name: 'Yönetici', description: 'Üst düzey yöneticiler', isPremium: true, color: 'from-amber-600 to-yellow-500', image: '/images/resume98956.png', category: 'Kurumsal' },
    { id: 'elegant', name: 'Zarif', description: 'Klasik ve sofistike', isPremium: true, color: 'from-stone-500 to-stone-700', image: '/images/resume6544.png', category: 'Yaratıcı' },
    { id: 'healthcare', name: 'Sağlık', description: 'Doktor ve hemşireler', isPremium: true, color: 'from-teal-500 to-cyan-600', image: '/images/resume689.png', category: 'Sektörel' },
    { id: 'academic', name: 'Akademik', description: 'Araştırmacılar için', isPremium: true, color: 'from-amber-700 to-amber-900', image: '/images/resume45475.png', category: 'Sektörel' },
    { id: 'finance', name: 'Finans', description: 'Bankacılar için', isPremium: true, color: 'from-emerald-700 to-emerald-900', image: '/images/resume4548547.png', category: 'Kurumsal' },
    { id: 'legal', name: 'Hukuk', description: 'Avukatlar için', isPremium: true, color: 'from-stone-700 to-stone-900', image: '/images/resume456447.png', category: 'Sektörel' },
    { id: 'marketing', name: 'Pazarlama', description: 'Pazarlamacılar için', isPremium: true, color: 'from-fuchsia-500 to-violet-600', image: '/images/resume457857.png', category: 'Yaratıcı' },
    { id: 'engineer', name: 'Mühendis', description: 'Mühendisler için', isPremium: true, color: 'from-zinc-700 to-zinc-900', image: '/images/resume457874.png', category: 'Teknoloji' },
    { id: 'retail', name: 'Satış', description: 'Satış uzmanları', isPremium: true, color: 'from-rose-500 to-pink-600', image: '/images/resume474544.png', category: 'Sektörel' },
    { id: 'hospitality', name: 'Turizm', description: 'Otelcilik sektörü', isPremium: true, color: 'from-amber-500 to-amber-700', image: '/images/resume47878.png', category: 'Sektörel' },
    { id: 'government', name: 'Kamu', description: 'Devlet memurları', isPremium: true, color: 'from-blue-800 to-blue-900', image: '/images/resume5644.png', category: 'Sektörel' },
    { id: 'freelancer', name: 'Freelancer', description: 'Serbest çalışanlar', isPremium: true, color: 'from-lime-500 to-green-600', image: '/images/resume56544.png', category: 'Bireysel' },
    { id: 'startup', name: 'Startup', description: 'Girişimciler için', isPremium: true, color: 'from-violet-600 to-purple-800', image: '/images/resume565656.png', category: 'Bireysel' },
    { id: 'international', name: 'Uluslararası', description: 'Global kariyer', isPremium: true, color: 'from-sky-600 to-sky-800', image: '/images/resume566565.png', category: 'Bireysel' },
    { id: 'portfolio', name: 'Portfolyo', description: 'Görsel ağırlıklı', isPremium: true, color: 'from-neutral-800 to-neutral-900', image: '/images/resume6544.png', category: 'Yaratıcı' },
    { id: 'scientist', name: 'Bilim İnsanı', description: 'Araştırmacılar için', isPremium: true, color: 'from-indigo-800 to-blue-900', image: '/images/resume656564.png', category: 'Bilim' },
    { id: 'artist', name: 'Sanatçı', description: 'Sanat profesyonelleri', isPremium: true, color: 'from-purple-600 to-pink-600', image: '/images/resume65677.png', category: 'Yaratıcı' },
    { id: 'teacher', name: 'Öğretmen', description: 'Eğitimcilier için', isPremium: true, color: 'from-amber-600 to-orange-600', image: '/images/resume689.png', category: 'Eğitim' },
    { id: 'chef', name: 'Şef', description: 'Mutfak profesyonelleri', isPremium: true, color: 'from-red-800 to-red-900', image: '/images/resume689896.png', category: 'Sektörel' },
    { id: 'photographer', name: 'Fotoğrafçı', description: 'Görsel sanatçılar', isPremium: true, color: 'from-gray-800 to-black', image: '/images/resume898965.png', category: 'Yaratıcı' },
    { id: 'musician', name: 'Müzisyen', description: 'Müzik profesyonelleri', isPremium: true, color: 'from-purple-800 to-purple-950', image: '/images/resume98956.png', category: 'Yaratıcı' },
    { id: 'athlet', name: 'Sporcu', description: 'Profesyonel sporcular', isPremium: true, color: 'from-orange-500 to-red-600', image: '/images/resume98985.png', category: 'Spor' },
    { id: 'pilot', name: 'Pilot', description: 'Havacılık profesyonelleri', isPremium: true, color: 'from-sky-800 to-blue-900', image: '/images/resume457874.png', category: 'Sektörel' },
    { id: 'construction', name: 'İnşaat', description: 'Yapı sektörü', isPremium: true, color: 'from-yellow-600 to-orange-600', image: '/images/resume474544.png', category: 'Sektörel' },
    { id: 'environment', name: 'Çevre', description: 'Çevre uzmanları', isPremium: true, color: 'from-emerald-600 to-green-700', image: '/images/resume565656.png', category: 'Bilim' },
    { id: 'journalist', name: 'Gazeteci', description: 'Medya profesyonelleri', isPremium: true, color: 'from-slate-800 to-slate-900', image: '/images/resume65677.png', category: 'Yaratıcı' },
    { id: 'nurse', name: 'Hemşire', description: 'Sağlık çalışanları', isPremium: true, color: 'from-pink-500 to-rose-600', image: '/images/resume689.png', category: 'Sektörel' },
    { id: 'logistics', name: 'Lojistik', description: 'Tedarik zinciri', isPremium: true, color: 'from-blue-700 to-indigo-800', image: '/images/resume47878.png', category: 'Sektörel' },
    { id: 'security', name: 'Güvenlik', description: 'Güvenlik uzmanları', isPremium: true, color: 'from-slate-700 to-slate-900', image: '/images/resume5644.png', category: 'Sektörel' },
    { id: 'architect', name: 'Mimar', description: 'Mimarlık profesyonelleri', isPremium: true, color: 'from-neutral-700 to-neutral-900', image: '/images/resume456447.png', category: 'Yaratıcı' },
    { id: 'hr', name: 'İnsan Kaynakları', description: 'İK uzmanları', isPremium: true, color: 'from-violet-600 to-purple-700', image: '/images/resume56544.png', category: 'Kurumsal' },
    { id: 'datascience', name: 'Veri Bilimi', description: 'Data scientist', isPremium: true, color: 'from-cyan-600 to-purple-700', image: '/images/resume4548547.png', category: 'Teknoloji' },
    { id: 'gamer', name: 'E-Spor', description: 'Oyun profesyonelleri', isPremium: true, color: 'from-purple-700 to-pink-600', image: '/images/resume98985.png', category: 'Spor' },
    { id: 'consultant', name: 'Danışman', description: 'Danışmanlık uzmanları', isPremium: true, color: 'from-slate-600 to-slate-800', image: '/images/resume566565.png', category: 'Kurumsal' },
    { id: 'beauty', name: 'Güzellik', description: 'Güzellik uzmanları', isPremium: true, color: 'from-rose-400 to-pink-500', image: '/images/resume457857.png', category: 'Sektörel' },
    { id: 'lawyer_pro', name: 'Hukuk Pro', description: 'Kıdemli avukatlar', isPremium: true, color: 'from-stone-800 to-black', image: '/images/0145545.png', category: 'Sektörel' },
    { id: 'realestate', name: 'Gayrimenkul', description: 'Emlak danışmanları', isPremium: true, color: 'from-orange-700 to-red-800', image: '/images/12544.png', category: 'Sektörel' },
    { id: 'logistic_pro', name: 'Lojistik Pro', description: 'Operasyon müdürleri', isPremium: true, color: 'from-blue-900 to-slate-900', image: '/images/242545.png', category: 'Sektörel' },
    { id: 'agriculture', name: 'Tarım Teknolojileri', description: 'Ziraat mühendisleri', isPremium: true, color: 'from-green-700 to-emerald-900', image: '/images/565654.png', category: 'Bilim' },
    { id: 'media_pro', name: 'Medya Yöneticisi', description: 'TV ve Radyo yapımcıları', isPremium: true, color: 'from-red-600 to-purple-900', image: '/images/5717525.png', category: 'Yaratıcı' },
    { id: 'fitness', name: 'Fitness Koç', description: 'Kişisel eğitmenler', isPremium: true, color: 'from-orange-500 to-yellow-600', image: '/images/578783.png', category: 'Spor' },
    { id: 'ecommerce', name: 'E-Ticaret Uzmanı', description: 'Dijital satış odaklı', isPremium: true, color: 'from-blue-500 to-indigo-600', image: '/images/6565665.png', category: 'Tech' },
    { id: 'tourism_elite', name: 'Elite Turizm', description: 'Turizm işletmecileri', isPremium: true, color: 'from-sky-400 to-blue-600', image: '/images/456441545.png', category: 'Sektörel' },
    { id: 'fashion', name: 'Moda Tasarım', description: 'Stilistler için', isPremium: true, color: 'from-pink-400 to-rose-500', image: '/images/45454545.png', category: 'Yaratıcı' },
    { id: 'architecture_pro', name: 'Mimar Pro', description: 'Restorasyon ve yapı', isPremium: true, color: 'from-neutral-800 to-neutral-900', image: '/images/resume456447.png', category: 'Yaratıcı' },
    { id: 'pilot_pro', name: 'Kaptan Pilot', description: 'Havacılık liderleri', isPremium: true, color: 'from-slate-900 to-blue-950', image: '/images/resume457874.png', category: 'Sektörel' },
    { id: 'psychologist', name: 'Psikolog', description: 'Klinik uzmanlık', isPremium: true, color: 'from-violet-400 to-purple-600', image: '/images/resume56544.png', category: 'Sektörel' },
    { id: 'socialmedia', name: 'Sosyal Medya', description: 'İçerik üreticileri', isPremium: true, color: 'from-fuchsia-500 to-pink-600', image: '/images/resume457857.png', category: 'Yaratıcı' },
    { id: 'blockchain', name: 'Web3 Develop', description: 'Blockchain uzmanları', isPremium: true, color: 'from-indigo-600 to-purple-900', image: '/images/resume65677.png', category: 'Teknoloji' },
    { id: 'productmanager', name: 'Ürün Müdürü', description: 'Stratejik planlama', isPremium: true, color: 'from-slate-700 to-slate-900', image: '/images/resume98956.png', category: 'Kurumsal' },
    { id: 'customersuccess', name: 'Müşteri Başarısı', description: 'İlişki yönetimi', isPremium: true, color: 'from-cyan-500 to-blue-500', image: '/images/resume566565.png', category: 'Kurumsal' },
    { id: 'dataanalyst', name: 'Veri Analisti', description: 'İstatistik odaklı', isPremium: true, color: 'from-blue-600 to-indigo-700', image: '/images/resume4548547.png', category: 'Teknoloji' },
    { id: 'translator', name: 'Tercüman', description: 'Dil uzmanları', isPremium: true, color: 'from-amber-600 to-orange-700', image: '/images/resume689.png', category: 'Bireysel' },
    { id: 'veterinary', name: 'Veteriner', description: 'Hayvan sağlığı', isPremium: true, color: 'from-emerald-500 to-teal-600', image: '/images/resume656564.png', category: 'Sektörel' },
    { id: 'civilengineer', name: 'İnşaat Müh Pro', description: 'Saha mühendisleri', isPremium: true, color: 'from-orange-800 to-yellow-900', image: '/images/resume474544.png', category: 'Sektörel' },
    // Ultra Premium Collection - New 15
    { id: 'cyberpunk_v2', name: 'Neon Cyberpunk', description: 'Fütüristik siber tasarım', isPremium: true, color: 'from-cyan-500 to-purple-600', image: '/images/resume65677.png', category: 'Teknoloji' },
    { id: 'brutalist_pro', name: 'Raw Brutalist', description: 'Ham ve cesur minimalizm', isPremium: true, color: 'from-slate-900 to-black', image: '/images/resume566565.png', category: 'Yaratıcı' },
    { id: 'executive_gold', name: 'Executive Gold', description: 'Lüks yönetici stili', isPremium: true, color: 'from-amber-500 to-yellow-600', image: '/images/resume98956.png', category: 'Kurumsal' },
    { id: 'swiss_grid', name: 'Swiss Design', description: 'İsviçre grid sistemi', isPremium: true, color: 'from-red-600 to-red-800', image: '/images/resume456447.png', category: 'Kurumsal' },
    { id: 'magazine_vogue', name: 'Magazine Edition', description: 'Dergi tarzı editorial', isPremium: true, color: 'from-stone-800 to-stone-900', image: '/images/resume6544.png', category: 'Yaratıcı' },
    { id: 'glass_dream', name: 'Glassmorphism Pro', description: 'Cam efektli modern', isPremium: true, color: 'from-sky-500 to-purple-500', image: '/images/resume689896.png', category: 'Genel' },
    { id: 'minimal_mono', name: 'Minimal Mono', description: 'Siyah beyaz minimalizm', isPremium: true, color: 'from-gray-800 to-black', image: '/images/resume656564.png', category: 'Genel' },
    { id: 'future_slate', name: 'Silicon Valley', description: 'Teknoloji şirketi tarzı', isPremium: true, color: 'from-indigo-600 to-slate-900', image: '/images/resume565656.png', category: 'Teknoloji' },
    { id: 'soft_pill', name: 'Soft Interface', description: 'Yumuşak köşeli UI tarzı', isPremium: true, color: 'from-emerald-500 to-teal-600', image: '/images/resume457874.png', category: 'Genel' },
    { id: 'vertical_timeline', name: 'Timeline Story', description: 'Hikaye anlatımlı zaman çizelgesi', isPremium: true, color: 'from-amber-600 to-amber-800', image: '/images/resume47878.png', category: 'Kurumsal' },
    { id: 'metro_ui', name: 'Metro Cards', description: 'Microsoft Metro tasarım dili', isPremium: true, color: 'from-blue-600 to-blue-800', image: '/images/resume4548547.png', category: 'Genel' },
    { id: 'aurora_premium', name: 'Aurora Gradient', description: 'Canlı renk geçişleri', isPremium: true, color: 'from-pink-500 to-sky-500', image: '/images/resume457857.png', category: 'Yaratıcı' },
    { id: 'academic_serif', name: 'Elite Scholar', description: 'Akademik elit tasarım', isPremium: true, color: 'from-amber-700 to-stone-800', image: '/images/resume45475.png', category: 'Eğitim' },
    { id: 'dark_zen', name: 'Dark Zen', description: 'Minimalist karanlık zen', isPremium: true, color: 'from-slate-800 to-slate-950', image: '/images/resume5644.png', category: 'Genel' },
    { id: 'creative_chaos', name: 'Creative Flux', description: 'Kaotik yaratıcı enerji', isPremium: true, color: 'from-pink-600 to-indigo-600', image: '/images/resume98985.png', category: 'Yaratıcı' },
    // Ultra Premium v2 - 30 New Templates
    // Modern & Minimalist (8)
    { id: 'neo_gradient', name: 'Neo Gradient', description: 'Canlı mor-mavi degrade', isPremium: true, color: 'from-purple-600 to-blue-600', image: '/images/resume65677.png', category: 'Genel' },
    { id: 'paper_cut', name: 'Paper Cut', description: 'Katmanlı kağıt efekti', isPremium: true, color: 'from-pink-400 to-rose-500', image: '/images/resume98985.png', category: 'Yaratıcı' },
    { id: 'duo_tone', name: 'Duo Tone', description: 'İki tonlu modern tasarım', isPremium: true, color: 'from-slate-800 to-slate-400', image: '/images/resume566565.png', category: 'Genel' },
    { id: 'grid_master', name: 'Grid Master', description: 'Asimetrik grid layout', isPremium: true, color: 'from-yellow-400 to-yellow-600', image: '/images/resume456447.png', category: 'Yaratıcı' },
    { id: 'type_first', name: 'Typography First', description: 'Tipografi odaklı zarif', isPremium: true, color: 'from-slate-600 to-slate-800', image: '/images/resume45475.png', category: 'Kurumsal' },
    { id: 'white_space', name: 'White Space', description: 'Maksimum boşluk minimal', isPremium: true, color: 'from-indigo-100 to-indigo-300', image: '/images/resume689896.png', category: 'Genel' },
    { id: 'shadow_play', name: 'Shadow Play', description: 'Yumuşak gölge efektleri', isPremium: true, color: 'from-slate-200 to-blue-300', image: '/images/resume5644.png', category: 'Genel' },
    { id: 'clean_slate', name: 'Clean Slate', description: 'Ultra temiz profesyonel', isPremium: true, color: 'from-emerald-500 to-teal-600', image: '/images/resume474544.png', category: 'Kurumsal' },
    // Corporate & Professional (6)
    { id: 'board_room', name: 'Board Room', description: 'Yönetim kurulu stili', isPremium: true, color: 'from-blue-900 to-slate-900', image: '/images/resume98956.png', category: 'Kurumsal' },
    { id: 'corporate_edge', name: 'Corporate Edge', description: 'Keskin kurumsal', isPremium: true, color: 'from-red-600 to-slate-900', image: '/images/resume4548547.png', category: 'Kurumsal' },
    { id: 'power_point', name: 'Presentation Style', description: 'Sunum slaytları tarzı', isPremium: true, color: 'from-blue-600 to-yellow-500', image: '/images/resume565656.png', category: 'Kurumsal' },
    { id: 'vintage_class', name: 'Vintage Class', description: 'Retro profesyonel', isPremium: true, color: 'from-amber-600 to-amber-800', image: '/images/resume47878.png', category: 'Kurumsal' },
    { id: 'luxury_matte', name: 'Luxury Matte', description: 'Mat lüks finish', isPremium: true, color: 'from-stone-600 to-stone-800', image: '/images/resume6544.png', category: 'Kurumsal' },
    { id: 'diploma_style', name: 'Diploma Style', description: 'Sertifika tarzı resmi', isPremium: true, color: 'from-emerald-700 to-emerald-900', image: '/images/resume56544.png', category: 'Eğitim' },
    // Tech & Futuristic (6)
    { id: 'terminal_hacker', name: 'Terminal Hacker', description: 'Kod terminal görünümü', isPremium: true, color: 'from-green-600 to-black', image: '/images/resume65677.png', category: 'Teknoloji' },
    { id: 'hologram_ui', name: 'Hologram UI', description: 'Hologram efektli UI', isPremium: true, color: 'from-cyan-500 to-blue-900', image: '/images/resume689896.png', category: 'Teknoloji' },
    { id: 'neural_net', name: 'Neural Network', description: 'Yapay sinir ağı temalı', isPremium: true, color: 'from-purple-600 to-pink-600', image: '/images/resume457857.png', category: 'Teknoloji' },
    { id: 'quantum_blue', name: 'Quantum Blue', description: 'Kuantum bilgisayar temalı', isPremium: true, color: 'from-sky-600 to-indigo-900', image: '/images/resume566565.png', category: 'Teknoloji' },
    { id: 'data_stream', name: 'Data Stream', description: 'Veri akışı dashboard', isPremium: true, color: 'from-emerald-600 to-slate-900', image: '/images/resume4548547.png', category: 'Teknoloji' },
    { id: 'robotics_core', name: 'Robotics Core', description: 'Robotik endüstri temalı', isPremium: true, color: 'from-orange-500 to-zinc-900', image: '/images/resume565656.png', category: 'Teknoloji' },
    // Creative & Artsy (6)
    { id: 'water_color', name: 'Water Color', description: 'Suluboya efektli pastel', isPremium: true, color: 'from-pink-300 to-blue-300', image: '/images/resume98985.png', category: 'Yaratıcı' },
    { id: 'neon_night', name: 'Neon Night', description: 'Neon gece kulübü tarzı', isPremium: true, color: 'from-pink-500 to-cyan-500', image: '/images/resume457857.png', category: 'Yaratıcı' },
    { id: 'retro_wave', name: 'Retro Wave', description: '80ler synthwave stili', isPremium: true, color: 'from-pink-600 to-orange-500', image: '/images/resume6544.png', category: 'Yaratıcı' },
    { id: 'ink_splash', name: 'Ink Splash', description: 'Mürekkep lekesi efektli', isPremium: true, color: 'from-stone-700 to-stone-900', image: '/images/resume5644.png', category: 'Yaratıcı' },
    { id: 'origami_paper', name: 'Origami Paper', description: 'Katlanmış kağıt efektleri', isPremium: true, color: 'from-rose-400 to-amber-300', image: '/images/resume689.png', category: 'Yaratıcı' },
    { id: 'pop_art', name: 'Pop Art', description: 'Çizgi roman tarzı canlı', isPremium: true, color: 'from-yellow-400 to-pink-500', image: '/images/resume656564.png', category: 'Yaratıcı' },
    // Industry & Niche (4)
    { id: 'medical_pro', name: 'Medical Pro', description: 'Tıbbi profesyonel', isPremium: true, color: 'from-emerald-500 to-emerald-700', image: '/images/resume56544.png', category: 'Sektörel' },
    { id: 'architect_blue', name: 'Architect Blueprint', description: 'Mimari blueprint tarzı', isPremium: true, color: 'from-blue-800 to-blue-950', image: '/images/resume456447.png', category: 'Sektörel' },
    { id: 'legal_brief', name: 'Legal Brief', description: 'Hukuk profesyoneli için', isPremium: true, color: 'from-slate-700 to-slate-900', image: '/images/resume45475.png', category: 'Sektörel' },
    { id: 'startup_pitch', name: 'Startup Pitch', description: 'Girişimci pitch deck', isPremium: true, color: 'from-violet-600 to-purple-700', image: '/images/resume65677.png', category: 'Teknoloji' },
    // Online Portfolio Templates
    { id: 'corporate_web', name: 'Web Corporate', description: 'Canlı kurumsal portfolyo', isPremium: true, color: 'from-blue-600 to-indigo-700', image: '/images/resume565656.png', category: 'Online Portfolio' },
    { id: 'neon_web', name: 'Web Neon', description: 'Glow efektli modern portfolyo', isPremium: true, color: 'from-purple-600 to-pink-600', image: '/images/resume65677.png', category: 'Online Portfolio' },
    { id: 'minimal_web', name: 'Web Minimal', description: 'Sade ve net online görünüm', isPremium: true, color: 'from-gray-600 to-gray-800', image: '/images/resume656564.png', category: 'Online Portfolio' },
    { id: 'terminal_web', name: 'Web Terminal', description: 'Developerlar için kod temalı', isPremium: true, color: 'from-emerald-600 to-black', image: '/images/resume65677.png', category: 'Online Portfolio' },
    { id: 'glass_web', name: 'Web Glass', description: 'Cam efektli fütüristik', isPremium: true, color: 'from-cyan-500 to-blue-500', image: '/images/resume689896.png', category: 'Online Portfolio' },
    { id: 'creative_web', name: 'Creative Web', description: 'Premium şablon', isPremium: true, color: 'from-blue-600 to-indigo-700', image: '/images/resume689896.png', category: 'Online Portfolio' },
    { id: 'dark_web', name: 'Dark Web', description: 'Premium şablon', isPremium: true, color: 'from-purple-600 to-pink-600', image: '/images/resume656564.png', category: 'Online Portfolio' },
    { id: 'gradient_web', name: 'Gradient Web', description: 'Premium şablon', isPremium: true, color: 'from-emerald-600 to-teal-700', image: '/images/resume565656.png', category: 'Online Portfolio' },
    { id: 'magazine_web', name: 'Magazine Web', description: 'Premium şablon', isPremium: true, color: 'from-amber-600 to-orange-700', image: '/images/resume98956.png', category: 'Online Portfolio' },
    { id: 'paper_web', name: 'Paper Web', description: 'Premium şablon', isPremium: true, color: 'from-rose-600 to-pink-700', image: '/images/resume98985.png', category: 'Online Portfolio' },
    { id: 'portfolio_web', name: 'Portfolio Web', description: 'Premium şablon', isPremium: true, color: 'from-cyan-600 to-blue-700', image: '/images/resume457874.png', category: 'Online Portfolio' },
    { id: 'retro_wave_web', name: 'Retro Wave Web', description: 'Premium şablon', isPremium: true, color: 'from-slate-700 to-slate-900', image: '/images/resume474544.png', category: 'Online Portfolio' },
    { id: 'aurora_web', name: 'Aurora Web', description: 'Premium şablon', isPremium: true, color: 'from-violet-600 to-purple-800', image: '/images/resume47878.png', category: 'Online Portfolio' },
    { id: 'synthwave_web', name: 'Synthwave Web', description: 'Premium şablon', isPremium: true, color: 'from-fuchsia-600 to-pink-700', image: '/images/resume4548547.png', category: 'Online Portfolio' },
    { id: 'brutalism_web', name: 'Brutalism Web', description: 'Premium şablon', isPremium: true, color: 'from-teal-600 to-green-700', image: '/images/resume456447.png', category: 'Online Portfolio' },
    { id: 'aquaris_web', name: 'Aquaris Web', description: 'Premium şablon', isPremium: true, color: 'from-red-600 to-orange-700', image: '/images/resume457857.png', category: 'Online Portfolio' },
    { id: 'neo_tokyo_web', name: 'Neo Tokyo Web', description: 'Premium şablon', isPremium: true, color: 'from-indigo-600 to-blue-800', image: '/images/resume6544.png', category: 'Online Portfolio' },
    { id: 'cinematic_web', name: 'Cinematic Web', description: 'Premium şablon', isPremium: true, color: 'from-stone-600 to-stone-800', image: '/images/resume5644.png', category: 'Online Portfolio' },
    { id: 'solaris_web', name: 'Solaris Web', description: 'Premium şablon', isPremium: true, color: 'from-sky-600 to-cyan-700', image: '/images/resume56544.png', category: 'Online Portfolio' },
    { id: 'infinity_web', name: 'Infinity Web', description: 'Premium şablon', isPremium: true, color: 'from-lime-600 to-green-700', image: '/images/resume566565.png', category: 'Online Portfolio' },
    { id: 'origami_web', name: 'Origami Web', description: 'Premium şablon', isPremium: true, color: 'from-orange-600 to-red-700', image: '/images/resume689.png', category: 'Online Portfolio' },
    { id: 'wilderness_web', name: 'Wilderness Web', description: 'Premium şablon', isPremium: true, color: 'from-neutral-700 to-neutral-900', image: '/images/resume45475.png', category: 'Online Portfolio' },
    { id: 'arcade_web', name: 'Arcade Web', description: 'Premium şablon', isPremium: true, color: 'from-yellow-600 to-amber-700', image: '/images/0145545.png', category: 'Online Portfolio' },
    { id: 'timeline_web', name: 'Timeline Web', description: 'Premium şablon', isPremium: true, color: 'from-pink-600 to-rose-700', image: '/images/12544.png', category: 'Online Portfolio' },
    { id: 'holographic_web', name: 'Holographic Web', description: 'Premium şablon', isPremium: true, color: 'from-gray-700 to-gray-900', image: '/images/242545.png', category: 'Online Portfolio' },
    { id: 'museum_web', name: 'Museum Web', description: 'Premium şablon', isPremium: true, color: 'from-blue-800 to-purple-900', image: '/images/565654.png', category: 'Online Portfolio' },
    { id: 'dataviz_web', name: 'Dataviz Web', description: 'Premium şablon', isPremium: true, color: 'from-green-700 to-emerald-900', image: '/images/5717525.png', category: 'Online Portfolio' },
    { id: 'journal_web', name: 'Journal Web', description: 'Premium şablon', isPremium: true, color: 'from-red-700 to-rose-900', image: '/images/578783.png', category: 'Online Portfolio' },
    { id: 'spotify_web', name: 'Spotify Web', description: 'Premium şablon', isPremium: true, color: 'from-cyan-700 to-sky-800', image: '/images/6565665.png', category: 'Online Portfolio' },
    { id: 'chatgpt_web', name: 'Chatgpt Web', description: 'Premium şablon', isPremium: true, color: 'from-purple-700 to-indigo-800', image: '/images/456441545.png', category: 'Online Portfolio' },
    { id: 'bauhaus_legacy', name: 'Bauhaus Legacy', description: 'Premium şablon', isPremium: true, color: 'from-orange-700 to-yellow-800', image: '/images/45454545.png', category: 'Yaratıcı' },
    { id: 'glassmorphism_pro', name: 'Glassmorphism Pro', description: 'Premium şablon', isPremium: true, color: 'from-blue-600 to-indigo-700', image: '/images/resume689896.png', category: 'Genel' },
    { id: 'midnight_glow', name: 'Midnight Glow', description: 'Premium şablon', isPremium: true, color: 'from-purple-600 to-pink-600', image: '/images/resume656564.png', category: 'Genel' },
    { id: 'newspaper_class', name: 'Newspaper Class', description: 'Premium şablon', isPremium: true, color: 'from-emerald-600 to-teal-700', image: '/images/resume565656.png', category: 'Kurumsal' },
    { id: 'luxury_velvet', name: 'Luxury Velvet', description: 'Premium şablon', isPremium: true, color: 'from-amber-600 to-orange-700', image: '/images/resume98956.png', category: 'Kurumsal' },
    { id: 'organic_leaves', name: 'Organic Leaves', description: 'Premium şablon', isPremium: true, color: 'from-rose-600 to-pink-700', image: '/images/resume98985.png', category: 'Yaratıcı' },
    { id: 'blueprint_precision', name: 'Blueprint Precision', description: 'Premium şablon', isPremium: true, color: 'from-cyan-600 to-blue-700', image: '/images/resume457874.png', category: 'Teknoloji' },
    { id: 'pop_art_pulse', name: 'Pop Art Pulse', description: 'Premium şablon', isPremium: true, color: 'from-slate-700 to-slate-900', image: '/images/resume474544.png', category: 'Yaratıcı' },
    { id: 'scandi_minimal', name: 'Scandi Minimal', description: 'Premium şablon', isPremium: true, color: 'from-violet-600 to-purple-800', image: '/images/resume47878.png', category: 'Genel' },
    { id: 'futuro_hologram', name: 'Futuro Hologram', description: 'Premium şablon', isPremium: true, color: 'from-fuchsia-600 to-pink-700', image: '/images/resume4548547.png', category: 'Teknoloji' },
    { id: 'industrial_raw', name: 'Industrial Raw', description: 'Premium şablon', isPremium: true, color: 'from-teal-600 to-green-700', image: '/images/resume456447.png', category: 'Kurumsal' },
    { id: 'vogue_elite', name: 'Vogue Elite', description: 'Premium şablon', isPremium: true, color: 'from-red-600 to-orange-700', image: '/images/resume457857.png', category: 'Yaratıcı' },
    { id: 'zen_coda', name: 'Zen Coda', description: 'Premium şablon', isPremium: true, color: 'from-indigo-600 to-blue-800', image: '/images/resume6544.png', category: 'Genel' },
    { id: 'politician', name: 'Politician', description: 'Premium şablon', isPremium: true, color: 'from-stone-600 to-stone-800', image: '/images/resume5644.png', category: 'Kurumsal' },
    { id: 'lobbyist', name: 'Lobbyist', description: 'Premium şablon', isPremium: true, color: 'from-sky-600 to-cyan-700', image: '/images/resume56544.png', category: 'Kurumsal' },
    { id: 'strategic_advisor', name: 'Strategic Advisor', description: 'Premium şablon', isPremium: true, color: 'from-lime-600 to-green-700', image: '/images/resume566565.png', category: 'Kurumsal' },
    { id: 'actor', name: 'Actor', description: 'Premium şablon', isPremium: true, color: 'from-orange-600 to-red-700', image: '/images/resume689.png', category: 'Yaratıcı' },
    { id: 'director', name: 'Director', description: 'Premium şablon', isPremium: true, color: 'from-neutral-700 to-neutral-900', image: '/images/resume45475.png', category: 'Yaratıcı' },
    { id: 'voice_over', name: 'Voice Over', description: 'Premium şablon', isPremium: true, color: 'from-yellow-600 to-amber-700', image: '/images/0145545.png', category: 'Yaratıcı' },
    { id: 'jeweler', name: 'Jeweler', description: 'Premium şablon', isPremium: true, color: 'from-pink-600 to-rose-700', image: '/images/12544.png', category: 'Sektörel' },
    { id: 'tailor', name: 'Tailor', description: 'Premium şablon', isPremium: true, color: 'from-gray-700 to-gray-900', image: '/images/242545.png', category: 'Sektörel' },
    { id: 'sommelier', name: 'Sommelier', description: 'Premium şablon', isPremium: true, color: 'from-blue-800 to-purple-900', image: '/images/565654.png', category: 'Sektörel' },
    { id: 'ambassador', name: 'Ambassador', description: 'Premium şablon', isPremium: true, color: 'from-green-700 to-emerald-900', image: '/images/5717525.png', category: 'Kurumsal' },
    { id: 'philanthropist', name: 'Philanthropist', description: 'Premium şablon', isPremium: true, color: 'from-red-700 to-rose-900', image: '/images/578783.png', category: 'Kurumsal' },
    { id: 'intelligence_analyst', name: 'Intelligence Analyst', description: 'Premium şablon', isPremium: true, color: 'from-cyan-700 to-sky-800', image: '/images/6565665.png', category: 'Teknoloji' },
    { id: 'art_restorer', name: 'Art Restorer', description: 'Premium şablon', isPremium: true, color: 'from-purple-700 to-indigo-800', image: '/images/456441545.png', category: 'Yaratıcı' },
    { id: 'archivist', name: 'Archivist', description: 'Premium şablon', isPremium: true, color: 'from-orange-700 to-yellow-800', image: '/images/45454545.png', category: 'Eğitim' },
    { id: 'museum_curator', name: 'Museum Curator', description: 'Premium şablon', isPremium: true, color: 'from-blue-600 to-indigo-700', image: '/images/resume689896.png', category: 'Eğitim' },
    { id: 'yacht_captain', name: 'Yacht Captain', description: 'Premium şablon', isPremium: true, color: 'from-purple-600 to-pink-600', image: '/images/resume656564.png', category: 'Sektörel' },
    { id: 'private_jet_pilot', name: 'Private Jet Pilot', description: 'Premium şablon', isPremium: true, color: 'from-emerald-600 to-teal-700', image: '/images/resume565656.png', category: 'Sektörel' },
    { id: 'space_systems', name: 'Space Systems', description: 'Premium şablon', isPremium: true, color: 'from-amber-600 to-orange-700', image: '/images/resume98956.png', category: 'Teknoloji' },
    { id: 'close_protection', name: 'Close Protection', description: 'Premium şablon', isPremium: true, color: 'from-rose-600 to-pink-700', image: '/images/resume98985.png', category: 'Sektörel' },
    { id: 'cyber_forensics', name: 'Cyber Forensics', description: 'Premium şablon', isPremium: true, color: 'from-cyan-600 to-blue-700', image: '/images/resume457874.png', category: 'Teknoloji' },
    { id: 'crisis_manager', name: 'Crisis Manager', description: 'Premium şablon', isPremium: true, color: 'from-slate-700 to-slate-900', image: '/images/resume474544.png', category: 'Kurumsal' },
    { id: 'expedition_leader', name: 'Expedition Leader', description: 'Premium şablon', isPremium: true, color: 'from-violet-600 to-purple-800', image: '/images/resume47878.png', category: 'Sektörel' },
    { id: 'ethics_advisor', name: 'Ethics Advisor', description: 'Premium şablon', isPremium: true, color: 'from-fuchsia-600 to-pink-700', image: '/images/resume4548547.png', category: 'Kurumsal' },
    { id: 'survival_specialist', name: 'Survival Specialist', description: 'Premium şablon', isPremium: true, color: 'from-teal-600 to-green-700', image: '/images/resume456447.png', category: 'Sektörel' },
    { id: 'esports_pro', name: 'Esports Pro', description: 'Premium şablon', isPremium: true, color: 'from-red-600 to-orange-700', image: '/images/resume457857.png', category: 'Spor' },
    { id: 'formula_driver', name: 'Formula Driver', description: 'Premium şablon', isPremium: true, color: 'from-indigo-600 to-blue-800', image: '/images/resume6544.png', category: 'Spor' },
    { id: 'performance_psychologist', name: 'Performance Psychologist', description: 'Premium şablon', isPremium: true, color: 'from-stone-600 to-stone-800', image: '/images/resume5644.png', category: 'Sektörel' },
    { id: 'synthetic_biologist', name: 'Synthetic Biologist', description: 'Premium şablon', isPremium: true, color: 'from-sky-600 to-cyan-700', image: '/images/resume56544.png', category: 'Bilim' },
    { id: 'quantum_computing', name: 'Quantum Computing', description: 'Premium şablon', isPremium: true, color: 'from-lime-600 to-green-700', image: '/images/resume566565.png', category: 'Teknoloji' },
    { id: 'nano_engineer', name: 'Nano Engineer', description: 'Premium şablon', isPremium: true, color: 'from-orange-600 to-red-700', image: '/images/resume689.png', category: 'Teknoloji' },
    { id: 'philologist', name: 'Philologist', description: 'Premium şablon', isPremium: true, color: 'from-neutral-700 to-neutral-900', image: '/images/resume45475.png', category: 'Eğitim' },
    { id: 'epigrapher', name: 'Epigrapher', description: 'Premium şablon', isPremium: true, color: 'from-yellow-600 to-amber-700', image: '/images/0145545.png', category: 'Eğitim' },
    { id: 'mythologist', name: 'Mythologist', description: 'Premium şablon', isPremium: true, color: 'from-pink-600 to-rose-700', image: '/images/12544.png', category: 'Eğitim' },
    { id: 'astrobiologist', name: 'Astrobiologist', description: 'Premium şablon', isPremium: true, color: 'from-gray-700 to-gray-900', image: '/images/242545.png', category: 'Bilim' },
    { id: 'peace_negotiator', name: 'Peace Negotiator', description: 'Premium şablon', isPremium: true, color: 'from-blue-800 to-purple-900', image: '/images/565654.png', category: 'Kurumsal' },
    { id: 'climate_scientist', name: 'Climate Scientist', description: 'Premium şablon', isPremium: true, color: 'from-green-700 to-emerald-900', image: '/images/5717525.png', category: 'Bilim' },
    { id: 'ethical_hacker', name: 'Ethical Hacker', description: 'Premium şablon', isPremium: true, color: 'from-red-700 to-rose-900', image: '/images/578783.png', category: 'Teknoloji' },
    { id: 'futurist', name: 'Futurist', description: 'Premium şablon', isPremium: true, color: 'from-cyan-700 to-sky-800', image: '/images/6565665.png', category: 'Teknoloji' },
    { id: 'ghostwriter', name: 'Ghostwriter', description: 'Premium şablon', isPremium: true, color: 'from-purple-700 to-indigo-800', image: '/images/456441545.png', category: 'Yaratıcı' },
    { id: 'perfumer', name: 'Perfumer', description: 'Premium şablon', isPremium: true, color: 'from-orange-700 to-yellow-800', image: '/images/45454545.png', category: 'Sektörel' },
    { id: 'watchmaker', name: 'Watchmaker', description: 'Premium şablon', isPremium: true, color: 'from-blue-600 to-indigo-700', image: '/images/resume689896.png', category: 'Sektörel' },
    { id: 'luthier', name: 'Luthier', description: 'Premium şablon', isPremium: true, color: 'from-purple-600 to-pink-600', image: '/images/resume656564.png', category: 'Yaratıcı' },
    { id: 'vexillologist', name: 'Vexillologist', description: 'Premium şablon', isPremium: true, color: 'from-emerald-600 to-teal-700', image: '/images/resume565656.png', category: 'Eğitim' }
]

const categories = [
    { name: 'Tümü', icon: <LayoutGrid className="w-4 h-4" /> },
    { name: 'Genel', icon: <User className="w-4 h-4" /> },
    { name: 'Kurumsal', icon: <Building2 className="w-4 h-4" /> },
    { name: 'Yaratıcı', icon: <ImageIcon className="w-4 h-4" /> },
    { name: 'Teknoloji', icon: <Code className="w-4 h-4" /> },
    { name: 'Sektörel', icon: <Briefcase className="w-4 h-4" /> },
    { name: 'Bireysel', icon: <Globe className="w-4 h-4" /> },
    { name: 'Bilim', icon: <Sparkles className="w-4 h-4" /> },
    { name: 'Eğitim', icon: <GraduationCap className="w-4 h-4" /> },
    { name: 'Spor', icon: <Trophy className="w-4 h-4" /> },
    { name: 'Online Portfolio', icon: <Globe className="w-4 h-4" /> }
]

export default function TemplatesPage() {
    const [activeCategory, setActiveCategory] = useState('Tümü')
    const [searchQuery, setSearchQuery] = useState('')
    const [scrolled, setScrolled] = useState(false)
    const [backendTemplates, setBackendTemplates] = useState([])
    const [theme, setTheme] = useState('day')
    const isDayMode = theme === 'day'

    useEffect(() => {
        if (typeof window === 'undefined') return
        const storedTheme = window.localStorage.getItem('CVniz-home-theme')
        if (storedTheme === 'day' || storedTheme === 'night') {
            setTheme(storedTheme)
        }
    }, [])

    useEffect(() => {
        if (typeof window === 'undefined') return
        const handleThemeChange = (event) => {
            const nextTheme = event.detail
            if (nextTheme === 'day' || nextTheme === 'night') {
                setTheme(nextTheme)
            }
        }
        window.addEventListener('CVniz-theme-change', handleThemeChange)
        return () => window.removeEventListener('CVniz-theme-change', handleThemeChange)
    }, [])

    // Fetch backend templates to get thumbnails
    useEffect(() => {
        const fetchBackendTemplates = async () => {
            try {
                const res = await templateAPI.getAll()
                if (res.success && res.templates) {
                    setBackendTemplates(res.templates)
                }
            } catch (err) {
                console.log('Backend templates fetch failed, using defaults')
            }
        }
        fetchBackendTemplates()
    }, [])

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Merge static templates with backend thumbnails
    const mergedTemplates = useMemo(() => {
        return templates.map(t => {
            const backendT = backendTemplates.find(bt => bt.templateId === t.id)
            return {
                ...t,
                image: backendT?.thumbnail || t.image // Use backend thumbnail if available
            }
        })
    }, [backendTemplates])

    const filteredTemplates = useMemo(() => {
        return mergedTemplates.filter(template => {
            const matchesCategory = activeCategory === 'Tümü' || template.category === activeCategory
            const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                template.description.toLowerCase().includes(searchQuery.toLowerCase())
            return matchesCategory && matchesSearch
        })
    }, [activeCategory, searchQuery, mergedTemplates])

    const mutedText = isDayMode ? 'text-slate-600' : 'text-gray-400'
    const subtleText = isDayMode ? 'text-slate-500' : 'text-gray-500'
    const sectionBorder = isDayMode ? 'border-slate-200/70' : 'border-white/5'
    const overlayBackground = isDayMode ? 'bg-white/80' : 'bg-slate-950/60'
    const selectionColor = isDayMode ? 'selection:bg-sky-200/60' : 'selection:bg-cyan-500/30'

    return (
        <div className={`min-h-screen ${isDayMode ? 'bg-gradient-to-b from-white via-slate-50 to-white text-slate-900' : 'bg-slate-950 text-white'} ${selectionColor}`}>
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className={`absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px] animate-pulse ${isDayMode ? 'bg-sky-200/60' : 'bg-cyan-500/10'}`}></div>
                <div className={`absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full blur-[120px] ${isDayMode ? 'bg-rose-100/60' : 'bg-blue-500/5'}`}></div>
            </div>

            {/* Hero Section */}
            <section className={`relative pt-32 pb-20 px-6 lg:px-12 text-center overflow-hidden ${isDayMode ? 'bg-gradient-to-b from-white via-slate-50 to-white' : ''}`}>
                <AnimatedSection className="max-w-4xl mx-auto relative z-10">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-sm font-bold uppercase tracking-widest ${isDayMode
                        ? 'bg-white/90 border border-slate-200/70 text-sky-600 shadow-day'
                        : 'glass border-cyan-500/20 text-cyan-200'
                        }`}>
                        <Star className={`w-4 h-4 ${isDayMode ? 'text-sky-500 fill-sky-500' : 'text-cyan-400 fill-cyan-400'}`} />
                        <span>Profesyonel Tasarım Seçkisi</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
                        Kariyerinize Uygun <br />
                        <span className="gradient-text">Mükemmel Şablonu</span> Bulun
                    </h1>
                    <p className={`text-xl ${mutedText} mb-12 max-w-2xl mx-auto leading-relaxed`}>
                        ATS testi yapılmış, işe alım uzmanları tarafından onaylanmış 65'ten fazla tasarım arasından size en uygun olanı seçin.
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition-all duration-500"></div>
                        <div className={`relative flex items-center rounded-2xl px-6 py-4 border ${isDayMode ? 'bg-white border-slate-200/70 shadow-day' : 'bg-slate-900 border-white/10'}`}>
                            <Search className={`w-6 h-6 mr-4 ${isDayMode ? 'text-slate-400' : 'text-gray-500'}`} />
                            <input
                                type="text"
                                placeholder="Şablon adı veya stil ara..."
                                className={`bg-transparent border-none outline-none w-full text-lg ${isDayMode ? 'text-slate-900 placeholder:text-slate-400' : 'text-white placeholder:text-gray-600'}`}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <div className={`hidden md:flex items-center gap-2 text-xs font-bold px-2 py-1 rounded-md border ${isDayMode ? 'text-slate-500 bg-slate-50 border-slate-200/70' : 'text-gray-600 bg-white/5 border-white/5'}`}>
                                <Filter className="w-3 h-3" /> FILTER
                            </div>
                        </div>
                    </div>
                </AnimatedSection>
            </section>

            {/* Sticky Filter Bar */}
            <div className={`sticky top-0 z-40 transition-all duration-300 backdrop-blur-xl ${scrolled
                ? (isDayMode ? 'bg-white/90 border-b border-slate-200/70 shadow-day py-4' : 'bg-slate-950/80 border-b border-white/5 py-4')
                : 'py-8'
                }`}>
                <div className="max-w-7xl mx-auto px-6 overflow-x-auto no-scrollbar">
                    <div className="flex items-center lg:justify-center gap-3 lg:flex-wrap">
                        {categories.map(cat => (
                            <button
                                key={cat.name}
                                onClick={() => setActiveCategory(cat.name)}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 ${activeCategory === cat.name
                                    ? (isDayMode
                                        ? 'bg-sky-500 text-white shadow-[0_0_25px_rgba(14,165,233,0.4)]'
                                        : 'bg-cyan-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)]')
                                    : (isDayMode
                                        ? 'bg-white text-slate-600 border border-slate-200/70 hover:border-sky-200 shadow-sm'
                                        : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/5')
                                    }`}
                            >
                                {cat.icon}
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Templates Grid */}
            <section className={`py-12 px-6 lg:px-12 ${isDayMode ? 'bg-white/70 border-y border-slate-200/70' : ''}`}>
                <div className="max-w-7xl mx-auto">
                    {filteredTemplates.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {filteredTemplates.map((template, index) => (
                                <AnimatedSection
                                    key={template.id}
                                    delay={index * 50}
                                    className="group relative"
                                >
                                    <div className={`rounded-[32px] overflow-hidden transition-all duration-500 shadow-xl ${isDayMode
                                        ? 'bg-white border border-slate-200/70 shadow-day group-hover:border-sky-400/60'
                                        : 'glass-card border-white/5 group-hover:border-cyan-500/50 hover:shadow-cyan-500/10'
                                        }`}>
                                        {/* Image Container */}
                                        <div className={`relative aspect-[3/4] overflow-hidden ${isDayMode ? 'bg-slate-100' : 'bg-slate-900'}`}>
                                            <img
                                                src={template.image}
                                                alt={template.name}
                                                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                                            />

                                            {/* Badges */}
                                            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                                                {template.isPremium ? (
                                                    <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1.5 rounded-full shadow-lg">
                                                        <Crown className="w-3 h-3 text-white" />
                                                        <span className="text-[10px] font-black tracking-widest text-white">PREMIUM</span>
                                                    </div>
                                                ) : (
                                                    <div className="bg-emerald-500 px-3 py-1.5 rounded-full shadow-lg">
                                                        <span className="text-[10px] font-black tracking-widest text-white">ÜCRETSİZ</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Overlay Actions */}
                                            <div className={`absolute inset-0 ${overlayBackground} opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center p-6 gap-4`}>
                                                <Link
                                                    to={`/editor?template=${template.id}`}
                                                    className="w-full btn-premium py-4 text-center rounded-2xl font-black text-sm tracking-widest shadow-2xl translate-y-4 group-hover:translate-y-0 transition-all duration-500"
                                                >
                                                    HEMEN KULLAN
                                                </Link>
                                                <Link
                                                    to={`/editor?template=${template.id}&sample=true`}
                                                    className="w-full bg-white/10 backdrop-blur-md border border-white/10 py-4 text-center rounded-2xl font-black text-sm tracking-widest hover:bg-white/20 transition-all duration-300 translate-y-4 group-hover:translate-y-0 transition-all duration-700 flex items-center justify-center"
                                                >
                                                    ÖNİZLEME
                                                </Link>
                                            </div>

                                            {/* Category Tag (Top Right) */}
                                            <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className={`backdrop-blur-md px-3 py-1.5 rounded-xl border text-[10px] font-bold ${isDayMode ? 'bg-white/80 border-slate-200/70 text-slate-600 shadow-day' : 'bg-slate-950/80 border-white/10 text-gray-400'}`}>
                                                    {template.category}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Info Footer */}
                                        <div className={`p-6 ${isDayMode ? 'bg-gradient-to-b from-transparent to-slate-100' : 'bg-gradient-to-b from-transparent to-slate-950/50'}`}>
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className={`text-xl font-bold transition-colors ${isDayMode ? 'group-hover:text-sky-600' : 'group-hover:text-cyan-400'}`}>{template.name}</h3>
                                                <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,1)] animate-pulse"></div>
                                            </div>
                                            <p className={`${subtleText} text-sm line-clamp-1`}>{template.description}</p>
                                        </div>
                                    </div>

                                    {/* Bottom Glow */}
                                    <div className={`absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-2 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 ${isDayMode ? 'bg-sky-200/70' : 'bg-cyan-500/20'}`}></div>
                                </AnimatedSection>
                            ))}
                        </div>
                    ) : (
                        <div className={`text-center py-32 rounded-[48px] ${isDayMode ? 'bg-white border border-slate-200/70 shadow-day' : 'glass-card border-white/5'}`}>
                            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 border ${isDayMode ? 'bg-slate-50 border-slate-200/70 shadow-day text-slate-500' : 'bg-white/5 border-white/10'}`}>
                                <Search className="w-10 h-10" />
                            </div>
                            <h2 className="text-3xl font-bold mb-4">Şablon Bulunamadı</h2>
                            <p className={`${mutedText} max-w-md mx-auto`}>
                                "{searchQuery}" aramasıyla eşleşen bir sonuç bulamadık. Lütfen farklı bir anahtar kelime veya kategori deneyin.
                            </p>
                            <button
                                onClick={() => { setSearchQuery(''); setActiveCategory('Tümü'); }}
                                className={`mt-8 font-bold transition-colors ${isDayMode ? 'text-sky-600 hover:text-sky-700' : 'text-cyan-400 hover:text-cyan-300'}`}
                            >
                                Filtreleri Sıfırla
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* ATS Trust Section */}
            <section className={`py-24 px-6 lg:px-12 relative overflow-hidden ${isDayMode ? 'bg-gradient-to-b from-slate-50 to-white' : ''}`}>
                <AnimatedSection className={`max-w-7xl mx-auto px-6 py-24 border-y ${sectionBorder} ${isDayMode ? 'bg-white/70 rounded-[40px] shadow-day' : ''}`}>
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
                                <CheckCircle className="w-4 h-4 text-emerald-400" />
                                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">ATS Onaylı Altyapı</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
                                Tüm Şablonlarımız <br />
                                <span className="gradient-text">%100 ATS Uyumlu</span>
                            </h2>
                            <p className={`text-lg ${mutedText} mb-10 leading-relaxed`}>
                                Şablonlarımızın tamamı profesyonel takip sistemleri (ATS) ile test edilmiştir.
                                Format kayması olmadan verileriniz en doğru şekilde işlenir.
                            </p>
                            <div className="space-y-4">
                                {[
                                    'Standart font ve karakter kodlaması',
                                    'Okunabilir bölüm hiyerarşisi',
                                    'Karmaşık görsel öğelerden arındırılmış veri alanı',
                                    'Endüstri standardı dosya yapısı'
                                ].map((item, i) => (
                                    <div key={i} className={`flex items-center gap-3 ${mutedText}`}>
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isDayMode ? 'bg-sky-100 text-sky-600' : 'bg-cyan-500/20'}`}>
                                            <CheckCircle className={`w-3 h-3 ${isDayMode ? '' : 'text-cyan-400'}`} />
                                        </div>
                                        <span className="text-sm">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative group">
                            <div className={`absolute -inset-10 rounded-full blur-[100px] animate-pulse ${isDayMode ? 'bg-sky-100' : 'bg-cyan-500/10'}`}></div>
                            <div className={`rounded-3xl p-12 relative z-10 overflow-hidden ${isDayMode ? 'bg-white border border-slate-200/70 shadow-day' : 'glass-card border-white/10'}`}>
                                <div className={`absolute inset-0 ${isDayMode ? 'bg-gradient-to-br from-sky-100 via-transparent to-cyan-50' : 'bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-500/10'}`}></div>
                                <div className="space-y-8 relative z-10">
                                    <div className={`flex items-center justify-between pb-6 border-b ${sectionBorder}`}>
                                        <div className="text-2xl font-bold">ATS Score</div>
                                        <div className="text-4xl font-black text-cyan-400">98%</div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className={`flex justify-between text-xs font-bold uppercase tracking-widest ${mutedText}`}>
                                            <span>Okunabilirlik</span>
                                            <span className="text-cyan-400">YÜKSEK</span>
                                        </div>
                                        <div className={`h-2 rounded-full overflow-hidden ${isDayMode ? 'bg-slate-100' : 'bg-white/5'}`}>
                                            <div className="h-full bg-cyan-500 w-[96%]"></div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className={`flex justify-between text-xs font-bold uppercase tracking-widest ${mutedText}`}>
                                            <span>Veri Eşleşmesi</span>
                                            <span className="text-cyan-400">TAMAM</span>
                                        </div>
                                        <div className={`h-2 rounded-full overflow-hidden ${isDayMode ? 'bg-slate-100' : 'bg-white/5'}`}>
                                            <div className="h-full bg-cyan-500 w-[100%]"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </AnimatedSection>
            </section>

            {/* Final CTA */}
            <section className={`py-32 px-6 lg:px-12 text-center relative overflow-hidden ${isDayMode ? 'bg-gradient-to-b from-white to-slate-50' : ''}`}>
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] rounded-full blur-[160px] -z-10 animate-pulse ${isDayMode ? 'bg-sky-100' : 'bg-cyan-500/10'}`}></div>
                <AnimatedSection className={`max-w-4xl mx-auto rounded-[48px] p-20 relative z-10 ${isDayMode ? 'bg-white border border-slate-200/70 shadow-day' : 'glass-card border-white/10'}`}>
                    <div className={`w-20 h-20 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-2xl border ${isDayMode ? 'bg-slate-50 border-slate-200/70 text-sky-600' : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'}`}>
                        <Crown className="w-10 h-10" />
                    </div>
                    <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
                        Tüm Premium Şablonlara <br />
                        <span className="gradient-text">Anında Erişin</span>
                    </h2>
                    <p className={`text-xl ${mutedText} mb-12 max-w-xl mx-auto`}>
                        Aylık tek bir abonelik fiyatına 40'tan fazla premium şablonun ve AI araçlarının kilidini açın.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                        <Link to="/pricing" className="btn-premium px-12 py-5 text-xl font-black tracking-widest w-full sm:w-auto shadow-[0_20px_60px_-15px_rgba(6,182,212,0.6)]">
                            ŞİMDİ YÜKSELT
                        </Link>
                        <button className={`px-10 py-5 transition-all font-bold flex items-center gap-2 group ${isDayMode ? 'text-slate-600 hover:text-slate-900' : 'text-gray-400 hover:text-white'}`}>
                            Ücretli Planları İncele <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </AnimatedSection>
            </section>
        </div>
    )
}
