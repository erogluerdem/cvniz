// Admin Shared Components
import { TrendingUp, TrendingDown } from 'lucide-react'

// Mini Chart Component
export function MiniChart({ data, color = 'bg-cyan-400' }) {
    const max = Math.max(...data)
    return (
        <div className="flex items-end gap-0.5 h-8 mt-4">
            {data.map((value, i) => (
                <div
                    key={i}
                    className={`flex-1 ${color} rounded-sm opacity-60 hover:opacity-100 transition-opacity`}
                    style={{ height: `${(value / max) * 100}%` }}
                />
            ))}
        </div>
    )
}

// Stat Card Component
export function StatCard({ icon, label, value, change, changeType, chart }) {
    return (
        <div className="bg-white dark:bg-white/5 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
            <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-600 dark:text-white">
                    {icon}
                </div>
                {change && (
                    <span className={`text-sm flex items-center gap-1 ${changeType === 'positive' ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                        {changeType === 'positive' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {change}
                    </span>
                )}
            </div>
            <div className="text-3xl font-bold mb-1 text-gray-900 dark:text-white">{value}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
            {chart && <MiniChart data={chart} />}
        </div>
    )
}

// Data Table Component
export function DataTable({ columns, data, actions }) {
    return (
        <div className="bg-white dark:bg-white/5 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-white/5">
            <table className="w-full">
                <thead className="bg-gray-50 dark:bg-white/5">
                    <tr>
                        {columns.map(col => (
                            <th key={col.key} className="text-left px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                                {col.label}
                            </th>
                        ))}
                        {actions && <th className="text-left px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">İşlem</th>}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/10">
                    {data.map((row, i) => (
                        <tr key={i} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                            {columns.map(col => (
                                <td key={col.key} className="px-4 py-3 text-gray-700 dark:text-gray-200">
                                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                                </td>
                            ))}
                            {actions && <td className="px-4 py-3">{actions(row)}</td>}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

// Status Badge
export function StatusBadge({ status, type = 'default' }) {
    const colors = {
        success: 'bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20',
        warning: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20',
        error: 'bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/20',
        info: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-500/20',
        default: 'bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10'
    }
    return (
        <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${colors[type] || colors.default}`}>
            {status}
        </span>
    )
}

// Page Header
export function PageHeader({ title, subtitle, actions }) {
    return (
        <div className="flex items-center justify-between mb-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h1>
                {subtitle && <p className="text-slate-500 dark:text-gray-400 text-sm">{subtitle}</p>}
            </div>
            {actions && <div className="flex items-center gap-3">{actions}</div>}
        </div>
    )
}

// Filter Tabs
export function FilterTabs({ tabs, activeTab, onChange }) {
    return (
        <div className="flex gap-2 flex-wrap">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => onChange(tab.id)}
                    className={`px-4 py-2 rounded-xl text-sm transition-all font-medium border ${activeTab === tab.id
                        ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20 shadow-sm'
                        : 'bg-white dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/10 border-gray-200 dark:border-white/5'
                        }`}
                >
                    {tab.label} {tab.count !== undefined && `(${tab.count})`}
                </button>
            ))}
        </div>
    )
}

// Empty State
export function EmptyState({ icon, title, description }) {
    return (
        <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-4 text-slate-500 dark:text-gray-400">
                {icon}
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">{title}</h3>
            <p className="text-slate-500 dark:text-gray-400 text-sm">{description}</p>
        </div>
    )
}
