import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Video, Clock, ChevronLeft, ChevronRight, Search, X, Eye, MessageSquare, BarChart2, UserPlus, Trash2, Users } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { adminAPI } from '../services/api';
import { useUiStore } from '../store/uiStore';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Modal from '../components/ui/Modal';

const CHART_COLORS = { active: '#10B981', ended: '#3B82F6', waiting: '#F59E0B' };

const getAgentName = (session) => session.agents?.display_name || session.agent_name || 'Unknown agent';
const getCustomerName = (session) =>
  session.customer_name || session.participants?.find((p) => p.role === 'customer')?.display_name;

const formatDuration = (session) => {
  if (session.duration_seconds) return `${Math.floor(session.duration_seconds / 60)}m ${session.duration_seconds % 60}s`;
  if (!session.started_at) return '-';
  const secs = Math.max(0, Math.floor((Date.now() - new Date(session.started_at).getTime()) / 1000));
  return `${Math.floor(secs / 60)}m`;
};

const toStartOfDay = (date) => `${date}T00:00:00.000Z`;
const toEndOfDay = (date) => `${date}T23:59:59.999Z`;

export default function AdminDashboard() {
  const { showError, showSuccess } = useUiStore();
  const navigate = useNavigate();

  const [liveSessions, setLiveSessions] = useState([]);
  const [historySessions, setHistorySessions] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [historyPage, setHistoryPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [forceEndTarget, setForceEndTarget] = useState(null);
  const [isEnding, setIsEnding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [agents, setAgents] = useState([]);
  const [showCreateAgent, setShowCreateAgent] = useState(false);
  const [deleteAgentTarget, setDeleteAgentTarget] = useState(null);
  const [isCreatingAgent, setIsCreatingAgent] = useState(false);
  const [isDeletingAgent, setIsDeletingAgent] = useState(false);
  const [agentForm, setAgentForm] = useState({ email: '', password: '', displayName: '', role: 'agent' });
  const [agentFormError, setAgentFormError] = useState('');

  const loadLive = useCallback(async () => {
    try {
      const data = await adminAPI.getLiveSessions();
      setLiveSessions(Array.isArray(data) ? data : []);
    } catch { /* silent */ }
  }, []);

  const loadHistory = useCallback(async (page = 1) => {
    setIsLoading(true);
    try {
      const params = { page, limit: 20, ...(dateFrom ? { date_from: toStartOfDay(dateFrom) } : {}), ...(dateTo ? { date_to: toEndOfDay(dateTo) } : {}) };
      const result = await adminAPI.getSessionHistory(params);
      const sessions = Array.isArray(result) ? result : (result?.data ?? []);
      setHistorySessions(sessions);
      setPagination(result?.pagination ?? null);
      setHistoryPage(page);
    } catch { showError('Failed to load session history'); }
    finally { setIsLoading(false); }
  }, [dateFrom, dateTo, showError]);

  useEffect(() => { loadLive(); loadHistory(1); const t = setInterval(loadLive, 5000); return () => clearInterval(t); }, [loadLive, loadHistory]);

  const handleForceEnd = async () => {
    if (!forceEndTarget) return;
    setIsEnding(true);
    try { await adminAPI.forceEndSession(forceEndTarget.id); setForceEndTarget(null); loadLive(); loadHistory(historyPage); }
    catch { showError('Failed to end session'); }
    finally { setIsEnding(false); }
  };

  const loadAgents = useCallback(async () => {
    try { const data = await adminAPI.getAgents(); setAgents(Array.isArray(data) ? data : []); }
    catch { /* silent */ }
  }, []);

  const handleCreateAgent = async (e) => {
    e.preventDefault();
    if (!agentForm.email.trim() || !agentForm.password || !agentForm.displayName.trim()) return;
    setAgentFormError('');
    setIsCreatingAgent(true);
    try {
      await adminAPI.createAgent(agentForm);
      setAgentForm({ email: '', password: '', displayName: '', role: 'agent' });
      setShowCreateAgent(false);
      loadAgents();
      showSuccess('Agent created successfully');
    } catch (err) {
      setAgentFormError(err.message || 'Failed to create agent');
    } finally { setIsCreatingAgent(false); }
  };

  const handleDeleteAgent = async () => {
    if (!deleteAgentTarget) return;
    setIsDeletingAgent(true);
    try { await adminAPI.deleteAgent(deleteAgentTarget.id); setDeleteAgentTarget(null); loadAgents(); }
    catch { showError('Failed to delete agent'); }
    finally { setIsDeletingAgent(false); }
  };

  useEffect(() => { loadAgents(); }, [loadAgents]);

  const filteredHistory = searchQuery.trim()
    ? historySessions.filter(s => s.id?.toLowerCase().includes(searchQuery.toLowerCase()) || s.agents?.display_name?.toLowerCase().includes(searchQuery.toLowerCase()))
    : historySessions;

  const totalHistory = historySessions.length;
  const totalActive = liveSessions.length;
  const avgDur = totalHistory > 0 ? Math.round(historySessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) / totalHistory / 60) : 0;

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    return { day: d.toLocaleDateString('en-US', { weekday: 'short' }), date: d.toDateString(), sessions: 0 };
  });
  historySessions.forEach(s => { const sd = new Date(s.created_at).toDateString(); const f = last7Days.find(d => d.date === sd); if (f) f.sessions++; });

  const pieData = [
    { name: 'Active', value: totalActive, color: CHART_COLORS.active },
    { name: 'Ended', value: historySessions.filter(s => s.status === 'ended').length, color: CHART_COLORS.ended },
    { name: 'Waiting', value: historySessions.filter(s => s.status === 'waiting').length, color: CHART_COLORS.waiting },
  ].filter(d => d.value > 0);

  const statCards = [
    { label: 'Total Sessions', value: totalHistory, icon: BarChart2, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { label: 'Active Sessions', value: totalActive, icon: Video, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    { label: 'Total Messages', value: 0, icon: MessageSquare, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
    { label: 'Avg Duration', value: avgDur > 0 ? `${avgDur}m` : '--', icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  ];

  const chartTooltipStyle = { background: '#111827', border: 'none', borderRadius: 8, color: '#fff', fontSize: 12 };
  const axisStyle = { fill: '#4B5563', fontSize: 11 };
  const gridStyle = { stroke: 'rgba(255,255,255,0.04)' };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Shield className="w-4 h-4 text-blue-400" />
            </div>
            Admin Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Monitor all support sessions</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="live" size="lg" pulse>{liveSessions.length} Live</Badge>
          <Button size="sm" onClick={() => setShowCreateAgent(true)}>
            <UserPlus className="w-4 h-4" />
            Create Agent
          </Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 perspective-1000">
        {statCards.map(({ label, value, icon: Icon, color, bg, border }, idx) => (
          <div
            key={label}
            className={`glass-card-premium p-4 flex items-center gap-4 card-3d animate-slide-up`}
            style={{ animationDelay: `${idx * 75}ms` }}
          >
            <div className={`w-10 h-10 rounded-xl ${bg} border ${border} flex items-center justify-center shrink-0`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
              <p className="text-xs text-gray-400/80">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      {!isLoading && (historySessions.length > 0 || liveSessions.length > 0) && (
        <div className="grid lg:grid-cols-2 gap-5 mb-8 animate-fade-in animation-delay-300">
          <div className="glass-card-premium p-5">
            <h3 className="text-sm font-semibold text-gray-300 mb-4">Sessions Over Time (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={last7Days} margin={{ top: 0, right: 8, left: -24, bottom: 0 }}>
                <CartesianGrid {...gridStyle} />
                <XAxis dataKey="day" tick={axisStyle} tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tick={axisStyle} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Line type="monotone" dataKey="sessions" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3, fill: '#3B82F6' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card-premium p-5">
            <h3 className="text-sm font-semibold text-gray-300 mb-4">Session Status Breakdown</h3>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {pieData.map((e) => <Cell key={e.name} fill={e.color} />)}
                  </Pie>
                  <Tooltip contentStyle={chartTooltipStyle} formatter={(v, n) => [v, n]} />
                  <Legend wrapperStyle={{ fontSize: 11, color: '#6B7280' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[200px] text-sm text-gray-600">No data yet</div>
            )}
          </div>
        </div>
      )}

      {/* Live sessions */}
      <section className="mb-8 animate-fade-in animation-delay-500">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Live Sessions</h2>
        {liveSessions.length === 0 ? (
          <EmptyState icon={Video} title="No active sessions" description="All support sessions have ended" />
        ) : (
          <div className="glass-table overflow-x-auto bg-bg-surface/50 backdrop-blur-md">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/6">
                  {['Session', 'Agent', 'Customer', 'Duration', ''].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {liveSessions.map((s) => (
                  <tr key={s.id} className="border-b border-white/4 hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3"><span className="font-mono text-xs text-gray-300">#{s.id.slice(0, 8)}</span></td>
                    <td className="px-4 py-3 text-sm text-gray-300">{getAgentName(s)}</td>
                    <td className="px-4 py-3 text-sm text-gray-300">{getCustomerName(s) || 'Waiting...'}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{formatDuration(s)}</td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="danger" size="sm" onClick={() => setForceEndTarget(s)}>End</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Session history */}
      <section className="mb-8 animate-fade-in animation-delay-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Session History</h2>
          <div className="flex items-center gap-2">
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
              className="glass-input text-xs py-1.5 w-32" aria-label="From date" />
            <span className="text-gray-600 text-xs">–</span>
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
              className="glass-input text-xs py-1.5 w-32" aria-label="To date" />
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
              <input type="text" placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="glass-input text-xs py-1.5 pl-8 pr-7 w-44" />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-gray-500 hover:text-gray-300">
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12"><Spinner size="lg" /></div>
        ) : filteredHistory.length === 0 ? (
          <EmptyState icon={Clock} title="No sessions found" description={searchQuery ? 'Try a different search term' : 'Past sessions will appear here'} />
        ) : (
          <>
            <div className="glass-table overflow-x-auto bg-bg-surface/50 backdrop-blur-md mb-4">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/6">
                    {['Session', 'Agent', 'Started', 'Duration', 'Recordings', ''].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.map((s) => (
                    <tr key={s.id} className="border-b border-white/4 hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3"><span className="font-mono text-xs text-gray-300">#{s.id.slice(0, 8)}</span></td>
                      <td className="px-4 py-3 text-sm text-gray-300">{getAgentName(s)}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{s.started_at ? new Date(s.started_at).toLocaleString() : '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{s.duration_seconds ? `${Math.floor(s.duration_seconds / 60)}m ${s.duration_seconds % 60}s` : '-'}</td>
                      <td className="px-4 py-3">
                        <Badge variant={s.recordings?.some(r => r.status === 'ready') ? 'live' : 'idle'} size="sm">
                          {s.recordings?.some(r => r.status === 'ready') ? 'Recorded' : 'None'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="secondary" size="sm" onClick={() => navigate(`/admin/sessions/${s.id}`)}>
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  {(pagination.page - 1) * pagination.limit + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
                </p>
                <div className="flex items-center gap-2">
                  <Button variant="secondary" size="sm" disabled={pagination.page <= 1} onClick={() => loadHistory(pagination.page - 1)}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-xs text-gray-500 px-2">{pagination.page}/{pagination.totalPages}</span>
                  <Button variant="secondary" size="sm" disabled={pagination.page >= pagination.totalPages} onClick={() => loadHistory(pagination.page + 1)}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {/* Agent Management */}
      <section className="mb-8 animate-fade-in animation-delay-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Agent Management</h2>
          <Button variant="secondary" size="sm" onClick={() => setShowCreateAgent(true)}>
            <UserPlus className="w-3.5 h-3.5" />
            Add Agent
          </Button>
        </div>

        {agents.length === 0 ? (
          <EmptyState icon={Users} title="No agents found" description="Create an agent to get started" />
        ) : (
          <div className="glass-table overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/6">
                  {['Name', 'Email', 'Role', 'Created', ''].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {agents.map((agent) => (
                  <tr key={agent.id} className="border-b border-white/4 hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-200">{agent.display_name || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{agent.email}</td>
                    <td className="px-4 py-3">
                      <Badge variant={agent.role === 'admin' ? 'warning' : 'idle'} size="sm">
                        {agent.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {agent.created_at ? new Date(agent.created_at).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => setDeleteAgentTarget(agent)}
                        aria-label={`Delete ${agent.email}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <ConfirmDialog isOpen={!!forceEndTarget} onClose={() => setForceEndTarget(null)} onConfirm={handleForceEnd}
        title="End session?" variant="danger" loading={isEnding}
        message={`End session #${forceEndTarget?.id?.slice(0, 8)}? Both participants will be disconnected.`}
        confirmLabel="End Session" />

      <Modal
        isOpen={showCreateAgent}
        onClose={() => { setShowCreateAgent(false); setAgentFormError(''); setAgentForm({ email: '', password: '', displayName: '', role: 'agent' }); }}
        title="Create New Agent"
        size="sm"
      >
        <form onSubmit={handleCreateAgent} className="space-y-4">
          {agentFormError && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {agentFormError}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Display Name</label>
            <input
              type="text"
              value={agentForm.displayName}
              onChange={e => setAgentForm(f => ({ ...f, displayName: e.target.value }))}
              className="glass-input w-full text-sm"
              placeholder="Jane Smith"
              required
              minLength={2}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Email</label>
            <input
              type="email"
              value={agentForm.email}
              onChange={e => setAgentForm(f => ({ ...f, email: e.target.value }))}
              className="glass-input w-full text-sm"
              placeholder="agent@company.com"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Password</label>
            <input
              type="password"
              value={agentForm.password}
              onChange={e => setAgentForm(f => ({ ...f, password: e.target.value }))}
              className="glass-input w-full text-sm"
              placeholder="Min. 8 characters"
              required
              minLength={8}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Role</label>
            <select
              value={agentForm.role}
              onChange={e => setAgentForm(f => ({ ...f, role: e.target.value }))}
              className="glass-input w-full text-sm appearance-none"
            >
              <option value="agent">Agent</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={() => { setShowCreateAgent(false); setAgentFormError(''); }}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isCreatingAgent}>
              {isCreatingAgent ? <Spinner size="sm" /> : 'Create Agent'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!deleteAgentTarget} onClose={() => setDeleteAgentTarget(null)} onConfirm={handleDeleteAgent}
        title="Delete agent?" variant="danger" loading={isDeletingAgent}
        message={`Remove ${deleteAgentTarget?.email}? They will lose access to SupportCast.`}
        confirmLabel="Delete Agent" />
    </div>
  );
}