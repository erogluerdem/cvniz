import { QRCodeSVG } from 'qrcode.react'

export default function QRCodeDisplay({ url, size = 80, label = 'Dijital Profil' }) {
    if (!url) return null

    return (
        <div className="flex flex-col items-center gap-2 p-2 bg-white border border-slate-100 rounded-lg inline-block shadow-sm">
            <QRCodeSVG
                value={url}
                size={size}
                level="L"
                includeMargin={false}
                imageSettings={{
                    src: "/logo.svg",
                    x: undefined,
                    y: undefined,
                    height: 15,
                    width: 15,
                    excavate: true,
                }}
            />
            {label && (
                <p className="text-[7px] font-black text-center text-slate-400 uppercase tracking-tighter">
                    {label}
                </p>
            )}
        </div>
    )
}
