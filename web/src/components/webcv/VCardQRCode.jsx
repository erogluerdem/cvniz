import React from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { QrCode, Download, Share2 } from 'lucide-react'
import { useToast } from '../../context/ToastContext'

export default function VCardQRCode({ isDayMode, userInfo = {} }) {
  const { toast } = useToast()

  const name = userInfo.name || 'Ahmet Yılmaz'
  const title = userInfo.title || 'Senior Software Engineer'
  const email = userInfo.email || 'ahmet@example.com'
  const phone = userInfo.phone || '+905551234567'

  // Construct vCard 3.0 string for contact saving
  const vCardString = `BEGIN:VCARD
VERSION:3.0
N:${name};;;;
FN:${name}
TITLE:${title}
EMAIL:${email}
TEL:${phone}
END:VCARD`

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: name,
        text: `${name} - ${title} dijital kartviziti`,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('CV bağlantısı kopyalandı!')
    }
  }

  return (
    <div className={`p-6 rounded-2xl border flex flex-col items-center text-center font-primary ${isDayMode ? 'bg-white border-slate-200 shadow-sm' : 'glass-card border-white/10'}`}>
      <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-500 mb-3">
        <QrCode className="w-6 h-6" />
      </div>
      <h3 className={`text-base font-bold uppercase ${isDayMode ? 'text-slate-900' : 'text-white'}`}>Dijital Kartvizit & vCard</h3>
      <p className={`text-xs mb-4 ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>Mobil kameradan okutarak kişiyi rehbere kaydedin.</p>

      <div className="p-4 bg-white rounded-2xl shadow-md border border-slate-100 mb-4">
        <QRCodeSVG value={vCardString} size={150} level="H" />
      </div>

      <div className="flex gap-2 w-full">
        <button
          onClick={handleShare}
          className="flex-1 py-2.5 px-4 rounded-xl bg-cyan-500 text-white font-semibold text-xs uppercase tracking-wider shadow-md hover:bg-cyan-600 transition-all flex items-center justify-center gap-2"
        >
          <Share2 className="w-3.5 h-3.5" /> PAYLAŞ
        </button>
      </div>
    </div>
  )
}
