import React from 'react'

export function SkeletonCard({ isDayMode, count = 1 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`p-6 rounded-2xl border space-y-4 ${
            isDayMode ? 'bg-white border-slate-200 shadow-sm' : 'bg-white/5 border-white/10'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className={`w-10 h-10 rounded-xl ${isDayMode ? 'bg-slate-200' : 'bg-white/10'}`} />
            <div className={`w-14 h-5 rounded-full ${isDayMode ? 'bg-slate-200' : 'bg-white/10'}`} />
          </div>
          <div className="space-y-2">
            <div className={`w-24 h-3 rounded ${isDayMode ? 'bg-slate-200' : 'bg-white/10'}`} />
            <div className={`w-32 h-7 rounded ${isDayMode ? 'bg-slate-300' : 'bg-white/20'}`} />
          </div>
        </div>
      ))}
    </div>
  )
}

export function SkeletonTable({ isDayMode, rows = 5 }) {
  return (
    <div className={`rounded-2xl border overflow-hidden animate-pulse ${isDayMode ? 'bg-white border-slate-200 shadow-sm' : 'bg-white/5 border-white/10'}`}>
      <div className={`p-4 border-b ${isDayMode ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'}`}>
        <div className={`w-48 h-4 rounded ${isDayMode ? 'bg-slate-300' : 'bg-white/20'}`} />
      </div>
      <div className="divide-y divide-slate-100 dark:divide-white/5">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className={`w-8 h-8 rounded-full ${isDayMode ? 'bg-slate-200' : 'bg-white/10'}`} />
              <div className="space-y-1 flex-1">
                <div className={`w-36 h-3.5 rounded ${isDayMode ? 'bg-slate-300' : 'bg-white/20'}`} />
                <div className={`w-24 h-2.5 rounded ${isDayMode ? 'bg-slate-200' : 'bg-white/10'}`} />
              </div>
            </div>
            <div className={`w-16 h-6 rounded-lg ${isDayMode ? 'bg-slate-200' : 'bg-white/10'}`} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function SkeletonLoader({ type = 'card', isDayMode = false, count = 4, rows = 5 }) {
  if (type === 'table') return <SkeletonTable isDayMode={isDayMode} rows={rows} />
  return <SkeletonCard isDayMode={isDayMode} count={count} />
}
