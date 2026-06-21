import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// 3D Glass Vault Cube Visualizer
const ThreeDVault: React.FC = () => {
  const [vaultState, setVaultState] = useState<'locked' | 'encrypting' | 'unlocked'>('locked');
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [rotation, setRotation] = useState(0);

  // Auto-rotate when not hovered
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 0.5) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, [isHovered]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5
    setCoords({ x, y });
  };

  const getBorderColor = () => {
    if (vaultState === 'locked') return 'border-blue-500/40 bg-blue-950/20 shadow-blue-500/10';
    if (vaultState === 'encrypting') return 'border-amber-500/40 bg-amber-950/20 shadow-amber-500/10';
    return 'border-emerald-500/40 bg-emerald-950/20 shadow-emerald-500/10';
  };

  const getCoreColor = () => {
    if (vaultState === 'locked') return 'from-blue-400 via-cyan-400 to-indigo-500 shadow-blue-500/40';
    if (vaultState === 'encrypting') return 'from-amber-400 via-orange-400 to-red-500 shadow-amber-500/40';
    return 'from-emerald-400 via-teal-400 to-emerald-600 shadow-emerald-500/40';
  };

  // Expand panel distance when unlocked
  const translateDist = vaultState === 'unlocked' ? '135px' : '90px';

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-900/30 border border-slate-800/80 rounded-3xl backdrop-blur-xl max-w-sm w-full mx-auto relative shadow-2xl overflow-hidden group select-none">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.03),transparent_70%)] pointer-events-none" />
      
      <div className="flex items-center gap-2 mb-6">
        <span className={`w-2 h-2 rounded-full ${vaultState === 'locked' ? 'bg-blue-500' : vaultState === 'encrypting' ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
        <h4 className="text-xs font-bold tracking-widest text-slate-400 uppercase font-mono">Vault 3D Simulation</h4>
      </div>

      <div 
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setCoords({ x: 0, y: 0 });
        }}
        className="relative w-64 h-64 flex items-center justify-center cursor-grab active:cursor-grabbing perspective-1000"
      >
        {/* 3D Cube Container */}
        <div 
          className="w-44 h-44 relative preserve-3d transition-transform duration-300 ease-out"
          style={{ 
            transform: isHovered 
              ? `rotateY(${coords.x * 70}deg) rotateX(${-coords.y * 70}deg)` 
              : `rotateY(${rotation}deg) rotateX(15deg)` 
          }}
        >
          {/* Glowing Inner Core */}
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-gradient-to-tr ${getCoreColor()} opacity-80 blur-md animate-pulse shadow-lg transition-all duration-500`} />
          
          {/* Floating Key Graphic */}
          <div 
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl transition-all duration-700 preserve-3d ${vaultState === 'unlocked' ? 'scale-130 translate-y-[-24px] rotate-12' : ''}`}
            style={{ transform: 'translateZ(0px)' }}
          >
            {vaultState === 'locked' ? '🔐' : vaultState === 'encrypting' ? '⏳' : '🔑'}
          </div>

          {/* Cube Faces */}
          {/* Front Face */}
          <div 
            className={`absolute inset-0 border rounded-xl flex flex-col items-center justify-center backdrop-blur-md transition-all duration-500 border-dashed ${getBorderColor()}`}
            style={{ transform: `translateZ(${translateDist})`, backfaceVisibility: 'hidden' }}
          >
            <span className="text-[10px] font-mono tracking-widest text-slate-500/80 uppercase font-bold">FRONT</span>
            <span className="text-xs font-semibold text-slate-300 mt-1">AES-256</span>
          </div>
          
          {/* Back Face */}
          <div 
            className={`absolute inset-0 border rounded-xl flex flex-col items-center justify-center backdrop-blur-md transition-all duration-500 border-dashed ${getBorderColor()}`}
            style={{ transform: `rotateY(180deg) translateZ(${translateDist})`, backfaceVisibility: 'hidden' }}
          >
            <span className="text-[10px] font-mono tracking-widest text-slate-500/80 uppercase font-bold">BACK</span>
            <span className="text-xs font-semibold text-slate-300 mt-1">ZERO-TR</span>
          </div>

          {/* Right Face */}
          <div 
            className={`absolute inset-0 border rounded-xl flex flex-col items-center justify-center backdrop-blur-md transition-all duration-500 border-dashed ${getBorderColor()}`}
            style={{ transform: `rotateY(90deg) translateZ(${translateDist})`, backfaceVisibility: 'hidden' }}
          >
            <span className="text-[10px] font-mono tracking-widest text-slate-500/80 uppercase font-bold">RIGHT</span>
            <span className="text-xs font-semibold text-slate-300 mt-1">SHARDS</span>
          </div>

          {/* Left Face */}
          <div 
            className={`absolute inset-0 border rounded-xl flex flex-col items-center justify-center backdrop-blur-md transition-all duration-500 border-dashed ${getBorderColor()}`}
            style={{ transform: `rotateY(-90deg) translateZ(${translateDist})`, backfaceVisibility: 'hidden' }}
          >
            <span className="text-[10px] font-mono tracking-widest text-slate-500/80 uppercase font-bold">LEFT</span>
            <span className="text-xs font-semibold text-slate-300 mt-1">SHARDS</span>
          </div>

          {/* Top Face */}
          <div 
            className={`absolute inset-0 border rounded-xl flex flex-col items-center justify-center backdrop-blur-md transition-all duration-500 border-dashed ${getBorderColor()}`}
            style={{ transform: `rotateX(90deg) translateZ(${translateDist})`, backfaceVisibility: 'hidden' }}
          >
            <span className="text-[10px] font-mono tracking-widest text-slate-500/80 uppercase font-bold">TOP</span>
            <span className="text-xs font-semibold text-slate-300 mt-1">GCM-IV</span>
          </div>

          {/* Bottom Face */}
          <div 
            className={`absolute inset-0 border rounded-xl flex flex-col items-center justify-center backdrop-blur-md transition-all duration-500 border-dashed ${getBorderColor()}`}
            style={{ transform: `rotateX(-90deg) translateZ(${translateDist})`, backfaceVisibility: 'hidden' }}
          >
            <span className="text-[10px] font-mono tracking-widest text-slate-500/80 uppercase font-bold">BOTTOM</span>
            <span className="text-xs font-semibold text-slate-300 mt-1">PBKDF2</span>
          </div>
        </div>
      </div>

      {/* Vault Controls */}
      <div className="grid grid-cols-3 gap-2.5 mt-8 w-full relative z-10">
        <button 
          onClick={() => setVaultState('locked')} 
          className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all duration-300 cursor-pointer ${vaultState === 'locked' ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'}`}
        >
          🔒 Locked
        </button>
        <button 
          onClick={() => setVaultState('encrypting')} 
          className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all duration-300 cursor-pointer ${vaultState === 'encrypting' ? 'bg-amber-600 border-amber-500 text-white shadow-lg shadow-amber-500/20' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'}`}
        >
          ⚠️ Warning
        </button>
        <button 
          onClick={() => setVaultState('unlocked')} 
          className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all duration-300 cursor-pointer ${vaultState === 'unlocked' ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'}`}
        >
          🔓 Release
        </button>
      </div>
    </div>
  );
};

// 3D Card Hover Feature wrapper
const FeatureCard3D: React.FC<{ icon: string; title: string; description: string }> = ({ icon, title, description }) => {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState(false);
  
  return (
    <div 
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setCoords({ x, y });
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        setCoords({ x: 0, y: 0 });
      }}
      className="p-8 bg-slate-900/30 border border-slate-800/80 rounded-3xl backdrop-blur-xl transition-all duration-200 shadow-xl overflow-hidden relative group"
      style={{
        transform: hover
          ? `perspective(1000px) rotateY(${coords.x * 20}deg) rotateX(${-coords.y * 20}deg) translateY(-4px)`
          : 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0px)',
        boxShadow: hover ? '0 20px 40px -15px rgba(59, 130, 246, 0.15)' : 'none'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-xl mb-6 relative z-10">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-3 relative z-10">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed relative z-10">{description}</p>
    </div>
  );
};

// Client Encryption Sandbox
const EncryptedSandbox: React.FC = () => {
  const [plaintext, setPlaintext] = useState('');
  const [ciphertext, setCiphertext] = useState('');
  const [status, setStatus] = useState<'idle' | 'encrypting' | 'encrypted' | 'uploaded'>('idle');

  const handleEncrypt = () => {
    if (!plaintext) return;
    setStatus('encrypting');
    setCiphertext('');
    
    // Simulate cryptographic matrix shuffle text typing
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    const targetCipher = 'U2FsdGVkX19' + btoa(plaintext).substring(0, 30) + '==';
    let currentLength = 0;
    
    const timer = setInterval(() => {
      currentLength += 2;
      const randomPart = Array.from({ length: targetCipher.length - currentLength }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
      setCiphertext(targetCipher.substring(0, currentLength) + randomPart);
      
      if (currentLength >= targetCipher.length) {
        clearInterval(timer);
        setCiphertext(targetCipher);
        setStatus('encrypted');
      }
    }, 40);
  };

  const handleUpload = () => {
    setStatus('uploaded');
    setTimeout(() => {
      setStatus('idle');
      setPlaintext('');
      setCiphertext('');
    }, 3000);
  };

  return (
    <div className="p-8 bg-slate-900/40 border border-slate-800/80 rounded-3xl backdrop-blur-xl relative overflow-hidden flex flex-col justify-between h-full shadow-2xl">
      <div className="absolute inset-0 bg-grid-white/[0.01] pointer-events-none" />
      <div>
        <h3 className="text-2xl font-bold text-white tracking-tight mb-2">Zero-Trust Local Sandbox</h3>
        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
          Test the browser-side encryption algorithm. Your text is compiled into a high-security ciphertext payload BEFORE reaching any network layers.
        </p>
        
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 font-mono">1. Plaintext Secret Entry</label>
            <textarea
              value={plaintext}
              onChange={(e) => setPlaintext(e.target.value)}
              placeholder="Enter sensitive keys, logins, recovery documents, or a final note..."
              className="w-full h-24 bg-slate-950/80 border border-slate-800/80 rounded-2xl px-4 py-3 text-sm text-slate-100 placeholder-slate-700 focus:outline-none focus:border-blue-500/50 transition-all resize-none font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 font-mono">2. Local AES-256-GCM Output</label>
            <div className="w-full h-24 bg-slate-950/80 border border-slate-800/80 rounded-2xl px-4 py-3 text-xs text-cyan-400/90 font-mono break-all overflow-y-auto selection:bg-cyan-500/20 selection:text-cyan-200 shadow-inner">
              {ciphertext ? (
                <span className="animate-matrix-glow">{ciphertext}</span>
              ) : (
                <span className="text-slate-700 italic">No cryptographic data generated. Write something above to start.</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-8">
        <button
          onClick={handleEncrypt}
          disabled={!plaintext || status === 'encrypting'}
          className="flex-1 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-xl text-sm font-bold border border-blue-500/30 transition-all duration-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-blue-500/10"
        >
          {status === 'encrypting' ? '🔑 Compiling Cipher...' : '🔒 Encrypt Locally'}
        </button>
        
        <button
          onClick={handleUpload}
          disabled={status !== 'encrypted'}
          className="flex-1 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          🚀 Dispatch Shard
        </button>
      </div>

      {status === 'uploaded' && (
        <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center text-center p-6 animate-fade-in z-20">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center text-2xl mb-4 text-emerald-400 animate-bounce">✓</div>
          <h4 className="text-xl font-bold text-white">Transmission Successful</h4>
          <p className="text-slate-400 text-xs max-w-xs mt-2 leading-relaxed font-medium">
            Local encryption finalized. Key shard uploaded to the zero-trust cluster. Decryption keys remain locally isolated under user control.
          </p>
        </div>
      )}
    </div>
  );
};

// Dead Man's Switch Simulator
const DeadMansSwitchSimulator: React.FC = () => {
  const [secondsLeft, setSecondsLeft] = useState(8);
  const [isRunning, setIsRunning] = useState(false);
  const [stage, setStage] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isRunning) {
      setIsRunning(false);
      triggerReleaseSequence();
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsLeft]);

  const handleStartSimulation = () => {
    setSecondsLeft(8);
    setIsRunning(true);
    setStage(0);
    setLogs(['[System] Monitoring switch... Periodic heartbeat ping set to active.']);
  };

  const handleExtendHeartbeat = () => {
    setSecondsLeft(8);
    setLogs((prev) => [...prev, `[System] Heartbeat received from browser extension. Countdown extended.`]);
  };

  const triggerReleaseSequence = () => {
    setStage(1);
    setLogs((prev) => [...prev, '[Stage 1] Inactivity detected. Heartbeat missed. Escalating alert...']);
    
    setTimeout(() => {
      setStage(2);
      setLogs((prev) => [...prev, '[Stage 2] Secondary alerts failed. Initiating Guardian Veto grace period (Veto window active).']);
    }, 1500);

    setTimeout(() => {
      setStage(3);
      setLogs((prev) => [...prev, '[Stage 3] Veto period elapsed. Retrieving cryptographic Shamir shares from distributed nodes...']);
    }, 3200);

    setTimeout(() => {
      setStage(4);
      setLogs((prev) => [...prev, '[Stage 4] Secret reconstructed. Vault decryption complete. Assets released securely to Eleanor & Charles.']);
    }, 4800);
  };

  const getStageStyle = (currentStage: number) => {
    if (stage >= currentStage) {
      if (currentStage === 4) return 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400';
      return 'bg-blue-500/10 border-blue-500/40 text-blue-400';
    }
    return 'bg-slate-950/40 border-slate-800/80 text-slate-600';
  };

  return (
    <div className="p-8 bg-slate-900/30 border border-slate-800/80 rounded-3xl backdrop-blur-xl shadow-2xl">
      <h3 className="text-3xl font-extrabold text-white tracking-tight mb-3">Dead Man's Switch Engine</h3>
      <p className="text-slate-400 text-sm mb-8 leading-relaxed max-w-3xl">
        Observe the automated release sequence in real time. Simulate a heartbeat timeout to watch the multi-stage security verification and cryptographic transmission pipeline activate.
      </p>

      <div className="grid md:grid-cols-2 gap-8 items-stretch">
        {/* Timer Panel */}
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between">
          <div className="text-center py-6">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono font-bold block mb-2">Simulated Heartbeat Clock</span>
            <div className="text-5xl font-black font-mono tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400">
              00:00:0{secondsLeft}s
            </div>
            <span className={`inline-block mt-4 px-3.5 py-1 rounded-full text-xs font-bold font-mono border ${isRunning ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 animate-pulse' : secondsLeft === 0 ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'}`}>
              {isRunning ? '⏱️ Switch Countdown Active' : secondsLeft === 0 ? '🚨 Verification Triggered' : '🟢 Primed'}
            </span>
          </div>

          <div className="space-y-3 mt-4">
            {!isRunning && secondsLeft !== 0 ? (
              <button
                onClick={handleStartSimulation}
                className="w-full py-3.5 bg-red-600/90 hover:bg-red-700 text-white rounded-xl text-sm font-bold border border-red-500/30 transition duration-200 cursor-pointer shadow-lg shadow-red-500/10"
              >
                🛑 Stop Heartbeat (Simulate Loss)
              </button>
            ) : (
              <button
                onClick={handleExtendHeartbeat}
                disabled={secondsLeft === 0}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold border border-blue-500/30 transition duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-blue-500/10"
              >
                ⚡ Send Heartbeat (Reset Switch)
              </button>
            )}
            {secondsLeft === 0 && (
              <button
                onClick={handleStartSimulation}
                className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl text-sm font-bold transition duration-200 cursor-pointer"
              >
                🔄 Restart Simulation
              </button>
            )}
          </div>
        </div>

        {/* Console Log */}
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono font-bold block mb-4">Diagnostics console ledger</span>
            <div className="space-y-3 font-mono text-[10px] leading-relaxed max-h-40 overflow-y-auto pr-2">
              {logs.map((log, index) => (
                <div key={index} className="text-cyan-400/90 border-l border-cyan-700/60 pl-3">
                  {log}
                </div>
              ))}
              {logs.length === 0 && (
                <div className="text-slate-700 italic">Console idle. Stop the heartbeat to monitor security checkpoints.</div>
              )}
            </div>
          </div>

          {/* Stage Indicators */}
          <div className="grid grid-cols-4 gap-2 mt-6">
            <div className={`border rounded-lg p-2 text-center text-[9px] font-bold transition-all duration-300 ${getStageStyle(1)}`}>
              <div className="mb-0.5 font-mono">S1</div>
              <div>Timeout</div>
            </div>
            <div className={`border rounded-lg p-2 text-center text-[9px] font-bold transition-all duration-300 ${getStageStyle(2)}`}>
              <div className="mb-0.5 font-mono">S2</div>
              <div>Guardian</div>
            </div>
            <div className={`border rounded-lg p-2 text-center text-[9px] font-bold transition-all duration-300 ${getStageStyle(3)}`}>
              <div className="mb-0.5 font-mono">S3</div>
              <div>Combine</div>
            </div>
            <div className={`border rounded-lg p-2 text-center text-[9px] font-bold transition-all duration-300 ${getStageStyle(4)}`}>
              <div className="mb-0.5 font-mono">S4</div>
              <div>Dispatch</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Lifecycle Timeline
const TimelineSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const steps = [
    {
      title: "1. Setup & Local Encryption",
      desc: "You add credentials and legal files to the platform. Everything is encrypted directly in your browser using AES-256 with a unique user key before being uploaded.",
      detail: "No plain text keys are ever sent or stored on the server. Zero-Knowledge guarantee."
    },
    {
      title: "2. Inactivity Monitoring",
      desc: "The Dead Man's Switch tracks your periodic pings. You configure the interval (e.g. 30, 90, or 365 days) and checking in is simple via dashboard login or email.",
      detail: "Automated alerts will notify you days before the countdown ends to prevent accidental triggers."
    },
    {
      title: "3. Double-Verification Grace Period",
      desc: "If the countdown reaches zero, the platform waits for a custom grace period and notifies trusted contacts or family guardians to veto if it was a false alert.",
      detail: "This adds an extra layer of human verification, ensuring the vault is never released prematurely."
    },
    {
      title: "4. Cryptographic Key Reassembly",
      desc: "Once verification window expires, the split key shards are combined cryptographically to rebuild your private key, allowing heirs to decrypt and retrieve files.",
      detail: "All data delivery occurs securely. The ledger commits an immutable audit trail of the transfer."
    }
  ];

  return (
    <div className="py-12">
      <h3 className="text-3xl font-extrabold text-white text-center mb-10 tracking-tight">Vault Transmission Lifecycle</h3>
      <div className="max-w-4xl mx-auto px-4">
        {/* Horizontal dot line */}
        <div className="relative flex justify-between items-center mb-10">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-900 -translate-y-1/2 z-0" />
          <div 
            className="absolute top-1/2 left-0 h-0.5 bg-blue-600 -translate-y-1/2 z-0 transition-all duration-500" 
            style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
          />
          
          {steps.map((step, idx) => (
            <button
              key={idx}
              onClick={() => setActiveStep(idx)}
              className={`relative z-10 w-11 h-11 rounded-full border-2 flex items-center justify-center font-bold text-sm transition-all duration-300 cursor-pointer shadow-lg ${
                activeStep === idx 
                  ? 'bg-blue-600 border-blue-400 text-white shadow-blue-500/30 scale-110' 
                  : activeStep > idx 
                    ? 'bg-slate-900 border-blue-500 text-blue-400' 
                    : 'bg-slate-950 border-slate-900 text-slate-500 hover:border-slate-800'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        {/* Active Step Content */}
        <div className="bg-slate-900/30 border border-slate-800/80 rounded-3xl p-8 backdrop-blur-xl relative min-h-48 flex flex-col justify-between transition-all duration-300 hover:border-slate-800 shadow-xl">
          <div>
            <h4 className="text-xl font-bold text-white mb-3">{steps[activeStep].title}</h4>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">{steps[activeStep].desc}</p>
          </div>
          <div className="p-4 rounded-xl bg-blue-950/15 border border-blue-900/20 text-xs text-blue-300 font-medium">
            💡 {steps[activeStep].detail}
          </div>
        </div>
      </div>
    </div>
  );
};

// FAQ Section
const FAQAccordion: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const faqs = [
    {
      q: "Can the platform creators read my stored passwords or crypto keys?",
      a: "No. The platform utilizes local client-side encryption (AES-256-GCM). The password or phrase you enter encrypts your files before being uploaded to our cloud. Since we never receive your decryption key, we cannot decrypt or view your files."
    },
    {
      q: "What happens if I accidentally miss a heartbeat ping?",
      a: "Multiple safeguards prevent premature release. First, we send notifications via email and SMS starting 7 days before the interval expires. Second, you can set a 'Grace Period' (e.g. 5 to 30 days) and assign trusted 'Guardians' who have the authority to veto the vault release sequence if you are safe."
    },
    {
      q: "How does the platform distribute the keys to my beneficiaries?",
      a: "When you define an Inheritance Rule, a key share is cryptographically mapped to the beneficiary's public credentials. Upon verified trigger, the platform delivers the encrypted asset vault together with the secondary decryption share, which can only be reconstructed by the specific heir."
    },
    {
      q: "Can I edit or cancel my vault entries at any time?",
      a: "Yes. As long as the Dead Man's Switch is active and safe, you have full ownership. You can add new assets, delete existing rules, verify new beneficiaries, or change the heartbeat interval on the fly."
    }
  ];

  return (
    <div className="py-12 max-w-3xl mx-auto px-4">
      <h3 className="text-3xl font-extrabold text-white text-center mb-10 tracking-tight">Frequently Asked Questions</h3>
      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div 
              key={idx} 
              className="border border-slate-800/80 rounded-2xl bg-slate-900/20 overflow-hidden transition-all duration-300 hover:border-slate-800 shadow-md"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full px-6 py-5 text-left flex justify-between items-center text-white hover:bg-slate-900/40 transition cursor-pointer"
              >
                <span className="font-bold text-sm sm:text-base pr-4">{faq.q}</span>
                <span className="text-blue-400 font-bold text-xl leading-none">
                  {isOpen ? '−' : '+'}
                </span>
              </button>
              <div 
                className={`transition-all duration-300 ease-in-out ${
                  isOpen ? 'max-h-48 border-t border-slate-900' : 'max-h-0'
                } overflow-hidden`}
              >
                <p className="px-6 py-5 text-xs sm:text-sm text-slate-400 leading-relaxed bg-slate-950/20">
                  {faq.a}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Main Landing Page
const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500 selection:text-white relative overflow-x-hidden">
      
      {/* Background glow grids */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-blue-600/5 blur-3xl pointer-events-none" />
      <div className="absolute top-[40%] right-1/4 w-[700px] h-[700px] rounded-full bg-purple-600/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-[600px] h-[600px] rounded-full bg-cyan-600/5 blur-3xl pointer-events-none" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#020617_1px,transparent_1px),linear-gradient(to_bottom,#020617_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-40" />

      {/* Navigation */}
      <nav className="fixed w-full bg-slate-950/60 backdrop-blur-md z-50 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <span className="text-xl font-extrabold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400 font-mono">WHEN I DIE</span>
            </div>
            
            <div className="hidden md:flex space-x-8 text-sm font-semibold text-slate-400">
              <a href="#concept" className="hover:text-white transition">The Concept</a>
              <a href="#simulator" className="hover:text-white transition">Live Engine</a>
              <a href="#sandbox" className="hover:text-white transition">Local Sandbox</a>
              <a href="#features" className="hover:text-white transition">Security Safeguards</a>
            </div>

            <div className="flex space-x-4 items-center">
              <Link to="/login" className="text-sm font-semibold text-slate-400 hover:text-white px-3 py-2 transition">Login</Link>
              <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition shadow-lg shadow-blue-500/25 border border-blue-500/30">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-36 pb-20 px-6 relative z-10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 text-left">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/5 bg-slate-900/50 text-xs font-semibold text-blue-400 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="font-mono">Zero-Knowledge Digital Inheritance Vault</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-500 drop-shadow-2xl">
              Secure Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400">Digital Legacy</span>
            </h1>

            <p className="text-base md:text-lg text-slate-400 max-w-xl leading-relaxed">
              Automated transmission for credentials, private keys, legal files, and message records. Release only occurs to designated beneficiaries after verified inactivity.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/register" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-8 py-4 rounded-2xl text-base font-bold transition shadow-xl shadow-blue-500/20 border border-blue-500/20 text-center">
                Start Legacy Vault
              </Link>
              <a href="#concept" className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl text-base font-semibold border border-slate-800 transition text-center">
                Explore Concept
              </a>
            </div>
          </div>

          <div className="w-full flex items-center justify-center animate-float">
            <ThreeDVault />
          </div>
        </div>
      </section>

      {/* Dead Man's Switch Live Simulator Section */}
      <section id="simulator" className="py-20 border-t border-slate-900 bg-slate-900/10">
        <div className="max-w-7xl mx-auto px-6">
          <DeadMansSwitchSimulator />
        </div>
      </section>

      {/* Local Encryption Sandbox Section */}
      <section id="sandbox" className="py-20 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <EncryptedSandbox />
            </div>
            <div className="space-y-6 text-left">
              <h3 className="text-3xl font-extrabold text-white tracking-tight">Zero-Knowledge Cryptography</h3>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                Most platform backups are unsafe because server administrators hold the master keys. With our protocol, your browser encrypts all secrets locally. The server only receives encrypted blobs, which are impossible to decipher without your client key.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-blue-950/40 text-blue-400 flex items-center justify-center font-bold text-xs mt-1 border border-blue-900/30">✓</div>
                  <p className="text-slate-300 text-sm font-semibold">Local client key derivation using PBKDF2 with salt.</p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-blue-950/40 text-blue-400 flex items-center justify-center font-bold text-xs mt-1 border border-blue-900/30">✓</div>
                  <p className="text-slate-300 text-sm font-semibold">AES-256-GCM authenticated cipher blocks.</p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-blue-950/40 text-blue-400 flex items-center justify-center font-bold text-xs mt-1 border border-blue-900/30">✓</div>
                  <p className="text-slate-300 text-sm font-semibold">Multi-shard key distribution: no single server holds the full secret.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Concept Section */}
      <section id="concept" className="py-20 border-t border-slate-900 bg-slate-900/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6 text-left">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                The Digital Afterlife Void
              </h2>
              <p className="text-slate-400 leading-relaxed">
                Billions of dollars in digital wealth—cryptocurrencies, software accounts, photo archives, and legal deeds—go completely lost each year simply because there is no secure, validated transmission path to family members.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-red-950/40 text-red-400 flex items-center justify-center font-bold text-xs mt-1 border border-red-900/30">✕</div>
                  <p className="text-slate-300 text-sm">Credentials remain locked in encrypted local folders, inaccessible forever.</p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-red-950/40 text-red-400 flex items-center justify-center font-bold text-xs mt-1 border border-red-900/30">✕</div>
                  <p className="text-slate-300 text-sm">Traditional wills are slow, static, and often leak keys during legal probate.</p>
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-900/30 border border-slate-800/80 rounded-3xl relative overflow-hidden backdrop-blur-xl shadow-2xl text-left">
              <h3 className="text-xl font-bold text-white mb-6">Traditional vs. WID Protocol</h3>
              <div className="space-y-4 text-xs sm:text-sm">
                <div className="p-4 rounded-xl bg-red-950/10 border border-red-900/20">
                  <span className="font-bold text-red-400 uppercase tracking-widest text-[10px] font-mono block mb-1">Legacy Methods</span>
                  <p className="text-slate-400">Shared passwords or physical paper keys. High risk of loss, theft, or unauthorized pre-mortem access.</p>
                </div>
                <div className="p-4 rounded-xl bg-blue-950/10 border border-blue-900/20">
                  <span className="font-bold text-blue-400 uppercase tracking-widest text-[10px] font-mono block mb-1">WID Vault Protocol</span>
                  <p className="text-slate-400">AES-256 local client encryption. Release only occurs after Dead Man's Switch expiration and cryptographic verification.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <TimelineSection />
        </div>
      </section>

      {/* Protocol Features (Tilt Cards) */}
      <section id="features" className="py-20 border-t border-slate-900 bg-slate-900/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Advanced Cryptographic Safeguards</h2>
            <p className="text-slate-400 text-base sm:text-lg">Designed as an immutable and legally defensible legacy vault.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard3D 
              icon="🛡️" 
              title="Zero-Trust Vault" 
              description="Assets are encrypted locally on your client machine before being uploaded. No one—not even administrators—can read your stored files." 
            />
            <FeatureCard3D 
              icon="⏳" 
              title="Dead Man's Switch" 
              description="Configurable inactivity pings require a heartbeat confirmation. If not received within the configured timeframe, the release sequence initiates." 
            />
            <FeatureCard3D 
              icon="🔗" 
              title="Immutable Audit Logs" 
              description="All authorization state changes, key updates, and validation requests are hashed and logged to an append-only cryptographic log." 
            />
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-20 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <FAQAccordion />
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 border-t border-slate-900 bg-gradient-to-t from-slate-950 via-slate-900/20 to-slate-950 relative overflow-hidden text-center px-6">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto space-y-8 relative z-10">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Take Control of Your Digital Afterlife</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
            Don't let your digital wealth, assets, and keys get locked away forever. Establish your zero-trust switch today and ensure secure delivery.
          </p>
          <div className="pt-4">
            <Link to="/register" className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-10 py-4.5 rounded-2xl text-lg font-bold transition shadow-2xl shadow-blue-500/20 border border-blue-500/30 inline-block">
              Create Legacy Vault Now
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-slate-500">
          <p>© 2026 WHEN I DIE. All rights reserved. Zero-Trust Legacy Architecture.</p>
          <div className="flex gap-6">
            <a href="#concept" className="hover:text-slate-400 transition">Privacy</a>
            <a href="#features" className="hover:text-slate-400 transition">Security Protocol</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;