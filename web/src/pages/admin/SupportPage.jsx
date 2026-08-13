import { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import {
  MessageCircle, Check, Clock, AlertCircle, User, Calendar, Send, X, Search, Plus,
  RefreshCw, CheckCircle2, Timer, Inbox, MoreVertical, Tag, ChevronRight, Zap
} from 'lucide-react'
import { useSupport } from '../../context/SupportContext'
import { userAPI } from '../../services/api'
import { useToast } from '../../context/ToastContext'

const statusConfig = {
  open: { label: 'Açık', color: 'bg-amber-500/20 text-amber-500', icon: Inbox },
  in_progress: { label: 'İşlemde', color: 'bg-blue-500/20 text-blue-500', icon: Timer },
  resolved: { label: 'Çözüldü', color: 'bg-green-500/20 text-green-500', icon: CheckCircle2 },
  closed: { label: 'Kapalı', color: 'bg-gray-500/20 text-gray-500', icon: Check }
}

const priorityConfig = {
  high: { label: 'Yüksek', color: 'bg-red-500/20 text-red-500', dot: 'bg-red-500' },
  medium: { label: 'Orta', color: 'bg-amber-500/20 text-amber-500', dot: 'bg-amber-500' },
  low: { label: 'Düşük', color: 'bg-gray-500/20 text-gray-500', dot: 'bg-gray-500' }
}

const categoryConfig = {
  general: { label: 'Genel', color: 'text-gray-500' },
  technical: { label: 'Teknik', color: 'text-cyan-500' },
  billing: { label: 'Ödeme', color: 'text-green-500' },
  account: { label: 'Hesap', color: 'text-purple-500' },
  feature: { label: 'Özellik', color: 'text-amber-500' }
}

export default function SupportPage() {
  const { toast } = useToast()
  const { isDayMode } = useOutletContext() || { isDayMode: false }
  const { allTickets, updateTicketStatus, addAdminReply, createTicket, loadAllTicketsAdmin} = useSupport()
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [replyText, setReplyText] = useState('')
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [userSearchText, setUserSearchText] = useState('')
  const [foundUsers, setFoundUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [isSearchingUsers, setIsSearchingUsers] = useState(false)
  const [newTicketData, setNewTicketData] = useState({
    subject: '',
    category: 'general',
    priority: 'medium',
    description: ''
  })

  useEffect(() => {
    if (selectedTicket) {
      const updated = (allTickets || []).find(t => (t._id || t.id) === (selectedTicket._id || selectedTicket.id))
      if (updated) setSelectedTicket(updated)
    }
  }, [allTickets])

 useEffect(() => {
 const timer = setTimeout(() => {
 if (userSearchText.trim().length >= 2) {
 handleUserSearch()
} else {
 setFoundUsers([])
}
}, 500)
 return () => clearTimeout(timer)
}, [userSearchText])

 const handleUserSearch = async () => {
 setIsSearchingUsers(true)
 try {
 const response = await userAPI.getUsers({ search: userSearchText, limit: 5})
 setFoundUsers(response.users || [])
} catch (error) {
 console.error('Kullanıcı arama hatası:', error)
} finally {
 setIsSearchingUsers(false)
}
}

 const filteredTickets = (allTickets || []).filter(t => {
 const matchesFilter = filter === 'all' || t.status === filter
 const matchesSearch = (t.subject || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
 (t.userName || '').toLowerCase().includes(searchQuery.toLowerCase())
 return matchesFilter && matchesSearch
})

 const handleUpdateStatus = async (id, status) => {
 await updateTicketStatus(id, status)
 toast.success(`Talep durumu"${statusConfig[status]?.label || status}" olarak güncellendi!`)
}

 const handleReply = async () => {
 if (!replyText.trim()) return
 const ticketId = selectedTicket._id || selectedTicket.id
 await addAdminReply(ticketId, replyText)
 await handleUpdateStatus(ticketId, 'in_progress')
 setReplyText('')
 toast.success('Yanıt gönderildi!')
}

 const handleCreateTicket = async (e) => {
 e.preventDefault()
 if (!selectedUser) {
 toast.error('Lütfen bir kullanıcı seçin')
 return
}

 const result = await createTicket({
 ...newTicketData,
 targetUserId: selectedUser.id || selectedUser._id
})

 if (result.success) {
 setIsCreateModalOpen(false)
 setNewTicketData({ subject: '', category: 'general', priority: 'medium', description: ''})
 setSelectedUser(null)
 setUserSearchText('')
 toast.success('Destek talebi oluşturuldu!')
} else {
 toast.error('Hata: ' + result.error)
}
}

 const stats = {
 total: (allTickets || []).length,
 open: (allTickets || []).filter(t => t.status === 'open').length,
 inProgress: (allTickets || []).filter(t => t.status === 'in_progress').length,
  closed: (allTickets || []).filter(t => t.status === 'resolved' || t.status === 'closed').length
 }

  return (
    <div className="space-y-6 font-primary">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className={`text-2xl font-semibold mb-1 uppercase flex items-center gap-3 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>
            <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/20">
              <MessageCircle className="w-6 h-6 text-amber-500" />
            </div>
            Destek Yönetimi
          </h2>
          <p className={`text-sm font-medium ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>Kullanıcı taleplerini yönetin ve yanıtlayın.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadAllTicketsAdmin}
            className={`p-3 rounded-2xl border transition-all ${isDayMode ? 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'}`}
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-6 py-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white font-semibold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> YENİ TALEP
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'TOPLAM', value: stats.total, icon: <MessageCircle className="w-4 h-4" />, color: 'cyan' },
          { label: 'AÇIK', value: stats.open, icon: <Inbox className="w-4 h-4" />, color: 'amber' },
          { label: 'İŞLEMDE', value: stats.inProgress, icon: <Timer className="w-4 h-4" />, color: 'blue' },
          { label: 'ÇÖZÜLDÜ', value: stats.closed, icon: <CheckCircle2 className="w-4 h-4" />, color: 'green' }
        ].map((stat, i) => (
          <div key={i} className={`rounded-2xl p-6 border relative overflow-hidden ${isDayMode ? 'bg-white border-slate-200 shadow-sm' : 'glass-card border-white/5'}`}>
            <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-500/10 blur-3xl -z-10`}></div>
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-xl bg-${stat.color}-500/10 text-${stat.color}-500`}>
                {stat.icon}
              </div>
              <span className={`text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>{stat.label}</span>
            </div>
            <div className={`text-3xl font-semibold ${isDayMode ? 'text-slate-900' : 'text-white'}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Tickets List */}
        <div className="lg:col-span-1 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${isDayMode ? 'text-slate-400' : 'text-gray-500'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Talep ara..."
              className={`w-full border rounded-2xl pl-12 pr-6 py-3.5 text-sm focus:outline-none focus:border-amber-500/30 transition-all font-bold ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400' : 'bg-white/5 border-white/5 text-white'}`}
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            {['all', 'open', 'in_progress', 'resolved'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all border ${filter === f
                    ? 'bg-amber-500/20 border-amber-500/30 text-amber-500'
                    : (isDayMode ? 'bg-white border-slate-200 text-slate-500 hover:text-slate-900 shadow-sm' : 'bg-transparent border-transparent text-gray-500 hover:text-gray-300')
                  }`}
              >
                {f === 'all' ? 'TÜMÜ' : statusConfig[f]?.label || f}
              </button>
            ))}
          </div>

          {/* Ticket List */}
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredTickets.length > 0 ? (
              filteredTickets.map(ticket => {
                const status = statusConfig[ticket.status] || statusConfig.open
                const priority = priorityConfig[ticket.priority] || priorityConfig.medium
                const StatusIcon = status.icon
                const isSelected = (selectedTicket?._id || selectedTicket?.id) === (ticket._id || ticket.id)

                return (
                  <div
                    key={ticket._id || ticket.id}
                    onClick={() => setSelectedTicket(ticket)}
                    className={`rounded-2xl p-5 cursor-pointer transition-all group relative overflow-hidden border ${isSelected
                        ? (isDayMode ? 'ring-2 ring-amber-500/50 bg-amber-50 border-amber-200 shadow-sm' : 'ring-2 ring-amber-500/50 bg-amber-500/5 border-amber-500/20')
                        : (isDayMode ? 'bg-white border-slate-200 hover:border-amber-300 hover:bg-slate-50 shadow-sm' : 'border-white/5 hover:border-amber-500/20 hover:bg-white/5')
                      }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${priority.dot}`}></div>
                        <h4 className={`font-bold text-sm truncate max-w-[180px] ${isDayMode ? 'text-slate-900' : 'text-white'}`}>{ticket.subject}</h4>
                      </div>
                      <ChevronRight className={`w-4 h-4 transition-all ${isSelected ? 'rotate-90 text-amber-500' : (isDayMode ? 'text-slate-400 group-hover:text-slate-600' : 'text-gray-600 group-hover:text-gray-400')}`} />
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                        <span className="text-xs font-semibold text-amber-500">{ticket.userName?.charAt(0)}</span>
                      </div>
                      <span className={`text-xs font-bold ${isDayMode ? 'text-slate-600' : 'text-gray-500'}`}>{ticket.userName}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded-lg text-xs font-semibold uppercase flex items-center gap-1 ${status.color}`}>
                        <StatusIcon className="w-3 h-3" /> {status.label}
                      </span>
                      <span className={`text-xs ${isDayMode ? 'text-slate-400' : 'text-gray-600'}`}>
                        {ticket.messages?.length || 0} mesaj
                      </span>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className={`text-center py-16 rounded-2xl border border-dashed ${isDayMode ? 'bg-slate-50 border-slate-300' : 'glass-card border-white/10'}`}>
                <MessageCircle className={`w-12 h-12 mx-auto mb-4 ${isDayMode ? 'text-slate-300' : 'text-gray-600'}`} />
                <h4 className={`text-lg font-semibold uppercase mb-1 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>TALEP BULUNAMADI</h4>
                <p className={`text-xs font-bold uppercase tracking-wider ${isDayMode ? 'text-slate-400' : 'text-gray-500'}`}>Kriterlere uyan talep yok.</p>
              </div>
            )}
          </div>
        </div>

        {/* Ticket Detail */}
        <div className="lg:col-span-2">
          {selectedTicket ? (
            <div className={`rounded-2xl p-8 border relative overflow-hidden ${isDayMode ? 'bg-white border-slate-200 shadow-sm' : 'glass-card border-white/5'}`}>
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-3xl -z-10"></div>

              {/* Header */}
              <div className="flex items-start justify-between mb-8">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className={`text-xl font-semibold uppercase tracking-tight ${isDayMode ? 'text-slate-900' : 'text-white'}`}>{selectedTicket.subject}</h3>
                    <span className={`text-xs px-2 py-1 rounded-lg font-mono ${isDayMode ? 'bg-slate-100 text-slate-600' : 'text-gray-500 bg-white/5'}`}>
                      #{(selectedTicket._id || selectedTicket.id).slice(-6)}
                    </span>
                  </div>
                  <div className={`flex items-center gap-4 text-sm ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>
                    <span className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                        <span className="text-xs font-semibold text-amber-500">{selectedTicket.userName?.charAt(0)}</span>
                      </div>
                      <span className="font-bold">{selectedTicket.userName}</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-xs">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(selectedTicket.createdAt).toLocaleDateString('tr-TR')}
                    </span>
                    <span className={`text-xs font-bold ${categoryConfig[selectedTicket.category]?.color || 'text-gray-400'}`}>
                      {categoryConfig[selectedTicket.category]?.label || 'Genel'}
                    </span>
                  </div>
                </div>

                {(selectedTicket.status !== 'closed' && selectedTicket.status !== 'resolved') && (
                  <button
                    onClick={() => handleUpdateStatus(selectedTicket._id || selectedTicket.id, 'resolved')}
                    className="px-5 py-2.5 rounded-xl bg-green-500/10 text-green-500 text-xs font-semibold uppercase tracking-wider hover:bg-green-500/20 transition-all flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" /> ÇÖZÜLDÜ
                  </button>
                )}
              </div>

              {/* Messages */}
              <div className="space-y-4 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {(selectedTicket.messages || []).map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-[1.5rem] p-5 ${msg.sender === 'admin'
                        ? (isDayMode ? 'bg-amber-50 border border-amber-200 rounded-br-lg' : 'bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-br-lg')
                        : (isDayMode ? 'bg-slate-100 border border-slate-200 rounded-bl-lg' : 'bg-white/5 border border-white/10 rounded-bl-lg')
                      }`}>
                      <div className="flex justify-between items-center gap-4 mb-2">
                        <span className={`text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>
                          {msg.sender === 'admin' ? 'DESTEK EKİBİ' : selectedTicket.userName}
                        </span>
                        <span className={`text-xs ${isDayMode ? 'text-slate-400' : 'text-gray-600'}`}>
                          {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                      </div>
                      <p className={`text-sm leading-relaxed ${isDayMode ? 'text-slate-800' : 'text-gray-300'}`}>{msg.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply Box */}
              {selectedTicket.status !== 'resolved' && selectedTicket.status !== 'closed' && (
                <div className={`border-t pt-6 ${isDayMode ? 'border-slate-200' : 'border-white/5'}`}>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-3 ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>YANIT GÖNDER</label>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={4}
                    placeholder="Kullanıcıya mesajınızı yazın..."
                    className={`w-full px-5 py-4 border rounded-2xl text-sm font-medium focus:outline-none focus:border-amber-500/30 resize-none mb-4 ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400' : 'bg-white/5 border-white/10 text-white'}`}
                  />
                  <div className="flex justify-between items-center">
                    <p className={`text-xs font-bold ${isDayMode ? 'text-slate-400' : 'text-gray-600'}`}>Yanıt gönderildiğinde durum otomatik olarak "İşlemde" olacaktır.</p>
                    <button
                      onClick={handleReply}
                      disabled={!replyText.trim()}
                      className="px-6 py-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white font-semibold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" /> GÖNDER
                    </button>
                  </div>
                </div>
              )}

              {/* Resolved Notice */}
              {(selectedTicket.status === 'resolved' || selectedTicket.status === 'closed') && (
                <div className={`border-t pt-6 ${isDayMode ? 'border-slate-200' : 'border-white/5'}`}>
                  <div className="flex items-center justify-center gap-3 py-6 bg-green-500/5 rounded-2xl border border-green-500/20">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-bold text-green-500">Bu talep çözüldü olarak işaretlendi.</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className={`rounded-2xl p-16 border border-dashed text-center ${isDayMode ? 'bg-slate-50 border-slate-300' : 'glass-card border-white/10'}`}>
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500/10 to-orange-500/10 flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-10 h-10 text-amber-500/50" />
              </div>
              <h4 className={`text-xl font-semibold uppercase mb-2 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>TALEP SEÇİN</h4>
              <p className={`text-sm font-medium ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>Detayları görüntülemek için sol taraftan bir talep seçin.</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
          <div className={`rounded-2xl p-8 max-w-2xl w-full border relative overflow-hidden animate-scale-in max-h-[90vh] overflow-y-auto ${isDayMode ? 'bg-white border-slate-200 shadow-2xl' : 'glass-card border-white/10'}`}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-3xl -z-10"></div>

            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className={`text-2xl font-semibold uppercase ${isDayMode ? 'text-slate-900' : 'text-white'}`}>YENİ DESTEK TALEBİ</h3>
                <p className={`text-sm font-medium ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>Bir kullanıcı adına talep oluşturun.</p>
              </div>
              <button onClick={() => setIsCreateModalOpen(false)} className={`p-2 rounded-xl border transition-all ${isDayMode ? 'bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-900' : 'bg-white/5 border-white/10 text-gray-500 hover:text-white'}`}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-5">
              {/* User Search */}
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>KULLANICI SEÇ</label>
                {selectedUser ? (
                  <div className="flex items-center justify-between p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                        <span className="text-sm font-semibold text-amber-500">{selectedUser.name?.charAt(0)}</span>
                      </div>
                      <div>
                        <div className={`font-bold ${isDayMode ? 'text-slate-900' : 'text-white'}`}>{selectedUser.name}</div>
                        <div className={`text-xs ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>{selectedUser.email}</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setSelectedUser(null); setUserSearchText('') }}
                      className={`p-2 rounded-xl transition-all ${isDayMode ? 'bg-slate-200 text-slate-600 hover:text-slate-900' : 'bg-white/10 text-gray-400 hover:text-white'}`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${isDayMode ? 'text-slate-400' : 'text-gray-500'}`} />
                    <input
                      type="text"
                      value={userSearchText}
                      onChange={(e) => setUserSearchText(e.target.value)}
                      placeholder="İsim veya e-posta ile ara..."
                      className={`w-full pl-12 pr-4 py-3.5 border rounded-2xl text-sm font-bold focus:outline-none focus:border-amber-500/30 ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400' : 'bg-white/5 border-white/10 text-white'}`}
                    />
                    {foundUsers.length > 0 && (
                      <div className={`absolute top-full left-0 right-0 mt-2 border rounded-2xl overflow-hidden z-10 shadow-2xl ${isDayMode ? 'bg-white border-slate-200' : 'bg-slate-900 border-white/10'}`}>
                        {foundUsers.map(user => (
                          <button
                            key={user._id || user.id}
                            type="button"
                            onClick={() => { setSelectedUser(user); setFoundUsers([]) }}
                            className={`w-full flex items-center gap-3 p-3 transition-all text-left ${isDayMode ? 'hover:bg-slate-50' : 'hover:bg-white/5'}`}
                          >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                              <span className="text-xs font-semibold text-amber-500">{user.name?.charAt(0)}</span>
                            </div>
                            <div>
                              <div className={`text-sm font-bold ${isDayMode ? 'text-slate-900' : 'text-white'}`}>{user.name}</div>
                              <div className={`text-xs ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>{user.email}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Subject */}
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>KONU</label>
                <input
                  type="text"
                  value={newTicketData.subject}
                  onChange={(e) => setNewTicketData({ ...newTicketData, subject: e.target.value })}
                  placeholder="Talep konusu..."
                  className={`w-full px-4 py-3.5 border rounded-2xl text-sm font-bold focus:outline-none focus:border-amber-500/30 ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400' : 'bg-white/5 border-white/10 text-white'}`}
                  required
                />
              </div>

              {/* Category & Priority */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>KATEGORİ</label>
                  <select
                    value={newTicketData.category}
                    onChange={(e) => setNewTicketData({ ...newTicketData, category: e.target.value })}
                    className={`w-full px-4 py-3.5 border rounded-2xl text-sm font-bold focus:outline-none focus:border-amber-500/30 ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-900 border-white/10 text-white'}`}
                  >
                    {Object.entries(categoryConfig).map(([key, val]) => (
                      <option key={key} value={key}>{val.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>ÖNCELİK</label>
                  <select
                    value={newTicketData.priority}
                    onChange={(e) => setNewTicketData({ ...newTicketData, priority: e.target.value })}
                    className={`w-full px-4 py-3.5 border rounded-2xl text-sm font-bold focus:outline-none focus:border-amber-500/30 ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-900 border-white/10 text-white'}`}
                  >
                    {Object.entries(priorityConfig).map(([key, val]) => (
                      <option key={key} value={key}>{val.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>AÇIKLAMA</label>
                <textarea
                  value={newTicketData.description}
                  onChange={(e) => setNewTicketData({ ...newTicketData, description: e.target.value })}
                  rows={4}
                  placeholder="Talep açıklaması..."
                  className={`w-full px-4 py-3.5 border rounded-2xl text-sm font-medium focus:outline-none focus:border-amber-500/30 resize-none ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400' : 'bg-white/5 border-white/10 text-white'}`}
                  required
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className={`flex-1 py-4 rounded-2xl font-semibold text-xs uppercase tracking-wider transition-all border ${isDayMode ? 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200' : 'bg-white/5 border-white/10 text-gray-500 hover:bg-white/10'}`}
                >
                  İPTAL
                </button>
                <button
                  type="submit"
                  className="flex-1 py-4 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white font-semibold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  TALEP OLUŞTUR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
