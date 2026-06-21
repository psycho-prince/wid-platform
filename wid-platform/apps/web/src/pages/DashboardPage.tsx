import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mockDb, Beneficiary, UserSettings } from '../services/mockDb';
import { AuditLogEntry } from '@wid-platform/contracts';

const DashboardPage: React.FC = () => {
  const [settings, setSettings] = useState<UserSettings>(mockDb.getSettings());
  const [assetsCount, setAssetsCount] = useState(mockDb.getAssets().length);
  const [rulesCount, setRulesCount] = useState(mockDb.getRules().length);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(mockDb.getBeneficiaries());
  const [logs, setLogs] = useState<AuditLogEntry[]>(mockDb.getLogs().slice(0, 5));
  const [timeLeft, setTimeLeft] = useState(0);
  const [isResetting, setIsResetting] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Calculate remaining seconds
  const calculateRemainingSeconds = (currentSettings: UserSettings) => {
    const lastHb = new Date(currentSettings.lastHeartbeat).getTime();
    const durationMs = currentSettings.heartbeatIntervalDays * 24 * 60 * 60 * 1000;
    const expiry = lastHb + durationMs;
    return Math.max(0, Math.floor((expiry - Date.now()) / 1000));
  };

  useEffect(() => {
    setTimeLeft(calculateRemainingSeconds(settings));
  }, [settings]);

  // Timer Tick
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    
    return {
      days: d,
      hours: h.toString().padStart(2, '0'),
      minutes: m.toString().padStart(2, '0'),
      seconds: s.toString().padStart(2, '0'),
      raw: `${d}d ${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`
    };
  };

  const handleResetSwitch = () => {
    setIsResetting(true);
    setTimeout(() => {
      const updated = mockDb.triggerHeartbeat();
      setSettings(updated);
      setLogs(mockDb.getLogs().slice(0, 5));
      setIsResetting(false);
    }, 800);
  };

  const formatted = formatTime(timeLeft);
  const totalDuration = settings.heartbeatIntervalDays * 24 * 60 * 60;
  const percentage = Math.min(100, Math.max(0, (timeLeft / totalDuration) * 100));
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400">
            Welcome, {settings.name || 'Legacy Owner'}
          </h2>
          <p className="text-slate-400 text-sm mt-1.5 font-medium">
            Your legacy status is protected. Zero-Trust vault encryption is active.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/app/assets"
            className="px-5 py-2.5 rounded-2xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 border border-blue-500/30 transition-all duration-300 flex items-center gap-2 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Asset
          </Link>
          <button
            onClick={handleResetSwitch}
            disabled={isResetting}
            className="px-5 py-2.5 rounded-2xl text-sm font-bold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-all duration-300 flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <svg className={`w-4 h-4 text-emerald-400 ${isResetting ? 'animate-spin' : 'animate-pulse'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            Trigger Heartbeat
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Dead Man's Switch Status (3D Glow Card) */}
        <div 
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            setCoords({ x, y });
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            setCoords({ x: 0, y: 0 });
          }}
          className="lg:col-span-2 relative group overflow-hidden glass-card rounded-3xl p-8 border border-slate-800/80 animate-pulse-glow transition-all duration-300 select-none"
          style={{
            transform: isHovered 
              ? `perspective(1000px) rotateY(${coords.x * 12}deg) rotateX(${-coords.y * 12}deg) scale3d(1.01, 1.01, 1.01)` 
              : 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)',
            boxShadow: isHovered ? '0 25px 50px -12px rgba(59, 130, 246, 0.25)' : 'none'
          }}
        >
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-blue-500/10 blur-3xl pointer-events-none group-hover:bg-blue-500/20 transition-all duration-700" />
          
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-widest font-mono">
                Active & Monitored
              </span>
              <h3 className="text-xl font-bold text-white mt-4">Dead Man's Switch Status</h3>
              <p className="text-slate-400 text-sm mt-1.5 font-medium">
                Your inheritance vault releases automatically if the switch countdown reaches zero.
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-slate-900/80 flex items-center justify-center border border-slate-800 text-emerald-400 shadow-md">
              <svg className="w-6 h-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>

          {/* Countdown Clock Display (Concentric Sci-Fi Radial indicator) */}
          <div className="flex flex-col items-center justify-center py-6 border-y border-slate-800/60 my-6">
            <span className="text-xs text-slate-500 uppercase tracking-widest font-mono font-bold mb-4">Time Until Release Sequence</span>
            
            <div className="relative flex items-center justify-center select-none">
              {/* Outer grid visual */}
              <div className="absolute inset-[-12px] border border-blue-500/5 rounded-full animate-[spin_40s_linear_infinite]" />
              <div className="absolute inset-[-6px] border border-dashed border-cyan-500/10 rounded-full animate-[spin_20s_linear_infinite_reverse]" />

              <svg className="w-48 h-48 -rotate-90 transform" viewBox="0 0 160 160">
                {/* Track circle */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  className="stroke-slate-900 fill-transparent"
                  strokeWidth="6"
                />
                {/* Progress Circle with glow */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  className="stroke-blue-600 fill-transparent transition-all duration-1000 ease-out"
                  strokeWidth="6"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  style={{
                    filter: 'drop-shadow(0 0 6px rgba(59, 130, 246, 0.5))'
                  }}
                />
              </svg>

              {/* Countdown metrics inside */}
              <div className="absolute flex flex-col items-center justify-center text-center font-mono">
                <div className="flex gap-2 items-baseline">
                  <div className="text-center">
                    <span className="block text-2xl font-black text-white">{formatted.days}</span>
                    <span className="text-[8px] text-slate-500 uppercase font-semibold tracking-wider block mt-0.5">days</span>
                  </div>
                  <span className="text-slate-600 text-lg font-bold">:</span>
                  <div className="text-center">
                    <span className="block text-2xl font-black text-white">{formatted.hours}</span>
                    <span className="text-[8px] text-slate-500 uppercase font-semibold tracking-wider block mt-0.5">hrs</span>
                  </div>
                  <span className="text-slate-600 text-lg font-bold">:</span>
                  <div className="text-center">
                    <span className="block text-2xl font-black text-white">{formatted.minutes}</span>
                    <span className="text-[8px] text-slate-500 uppercase font-semibold tracking-wider block mt-0.5">min</span>
                  </div>
                  <span className="text-slate-600 text-lg font-bold">:</span>
                  <div className="text-center">
                    <span className="block text-2xl font-black text-blue-400">{formatted.seconds}</span>
                    <span className="text-[8px] text-blue-400 uppercase font-semibold tracking-wider block mt-0.5">sec</span>
                  </div>
                </div>
                <div className="mt-2.5 bg-blue-950/40 border border-blue-900/30 px-3.5 py-1 rounded-full text-[9px] font-bold text-blue-400 tracking-widest uppercase">
                  {percentage.toFixed(0)}% Safe
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-550 font-medium mt-6">
              Last confirmed heartbeat: <span className="text-slate-300">{new Date(settings.lastHeartbeat).toLocaleString()}</span>
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleResetSwitch}
              disabled={isResetting}
              className={`flex-1 py-3.5 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-2 border shadow-lg cursor-pointer ${
                isResetting
                  ? "bg-slate-800/40 text-slate-500 border-slate-800 shadow-none"
                  : "bg-gradient-to-tr from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-blue-500/30 shadow-blue-500/10"
              }`}
            >
              {isResetting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Syncing Identity Key...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89H18" />
                  </svg>
                  Reset Switch (Extend {settings.heartbeatIntervalDays} Days)
                </>
              )}
            </button>
            <Link
              to="/app/account"
              className="px-6 py-3.5 rounded-2xl font-bold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-all duration-300 flex items-center justify-center cursor-pointer"
            >
              Configure Rule
            </Link>
          </div>
        </div>

        {/* Vault Summary Status */}
        <div className="glass-card rounded-3xl p-8 border border-slate-800/80 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-white mb-6">Vault Summary</h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-900 pb-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20 shadow-md">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Stored Assets</p>
                    <p className="text-xs text-slate-500 font-medium">AES-256 Encrypted</p>
                  </div>
                </div>
                <span className="text-2xl font-black text-white">{assetsCount}</span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-900 pb-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center border border-pink-500/20 shadow-md">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Active Heirs</p>
                    <p className="text-xs text-slate-500 font-medium">Identity Verified</p>
                  </div>
                </div>
                <span className="text-2xl font-black text-white">{beneficiaries.length}</span>
              </div>

              <div className="flex items-center justify-between pb-2">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20 shadow-md">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Inheritance Rules</p>
                    <p className="text-xs text-slate-500 font-medium">Trigger Pipelines</p>
                  </div>
                </div>
                <span className="text-2xl font-black text-white">{rulesCount}</span>
              </div>
            </div>
          </div>

          <Link
            to="/app/assets"
            className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 py-3 rounded-2xl text-sm font-bold transition-all duration-300 mt-8 cursor-pointer"
          >
            Manage Vault
          </Link>
        </div>
      </div>

      {/* Bottom Layout - Heirs and Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Heirs list */}
        <div className="glass-card rounded-3xl p-8 border border-slate-800/80">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">Beneficiary Allocations</h3>
            <Link to="/app/inheritance" className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition">Edit Allocation</Link>
          </div>
          
          <div className="space-y-4">
            {beneficiaries.map((heir) => (
              <div key={heir.id} className="p-4 rounded-2xl border border-slate-800 bg-slate-900/30 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-white">{heir.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">{heir.relationship} • {heir.email}</p>
                </div>
                <span className="text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3.5 py-1.5 rounded-full uppercase tracking-wider font-mono">
                  {heir.allocation}% Share
                </span>
              </div>
            ))}
            {beneficiaries.length === 0 && (
              <p className="text-slate-500 text-sm py-4 text-center font-medium">No beneficiaries added yet.</p>
            )}
          </div>
        </div>

        {/* Real-time Crypto Audit Feed */}
        <div className="glass-card rounded-3xl p-8 border border-slate-800/80">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">Cryptographic Audit Feed</h3>
            <Link to="/app/audit" className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition">View Full Ledger</Link>
          </div>

          <div className="space-y-4 font-mono text-[11px]">
            {logs.map((log) => {
              const getBadgeColor = (action: string) => {
                if (action.includes('HEARTBEAT') || action.includes('SUCCESS')) return 'text-emerald-400 bg-emerald-500/5 border-emerald-500/10';
                if (action.includes('DELETED') || action.includes('FAIL')) return 'text-red-400 bg-red-500/5 border-red-500/10';
                if (action.includes('ASSET')) return 'text-blue-400 bg-blue-500/5 border-blue-500/10';
                return 'text-purple-400 bg-purple-500/5 border-purple-500/10';
              };
              return (
                <div key={log.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl border border-slate-800/60 bg-slate-900/15">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${getBadgeColor(log.action)}`}>
                      {log.action}
                    </span>
                    <span className="text-slate-500 font-medium">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <span className="text-slate-400 font-medium flex items-center gap-1.5">
                    sig: 
                    <span className="text-slate-600 bg-slate-950 px-2 py-0.5 rounded border border-slate-900">
                      {log.cryptographicHash.substring(0, 12)}...
                    </span>
                  </span>
                </div>
              );
            })}
            {logs.length === 0 && (
              <p className="text-slate-500 text-sm py-4 text-center font-mono">No actions logged yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
