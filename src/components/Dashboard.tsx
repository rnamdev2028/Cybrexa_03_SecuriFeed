import { ShieldCheck, Flame, Cpu, Radio, Award, AlertTriangle, ArrowRight, TrendingUp, CheckCircle } from 'lucide-react';
import { NewsItem, ThreatReport } from '../types';

interface DashboardProps {
  newsList: NewsItem[];
  threatReports: ThreatReport[];
  setActiveTab: (tab: string) => void;
  scenariosCount: number;
}

export default function Dashboard({ newsList, threatReports, setActiveTab, scenariosCount }: DashboardProps) {
  const totalAnalyzed = 1452;
  const highRiskBlocked = 409;
  const liveAdvisories = newsList.length;
  const directSubmissions = threatReports.length;

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Hero Welcome Banner - Editorial Minimal Post Style */}
      <div className="relative overflow-hidden bg-[#0F0F11] p-10 border border-white/10">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-3xl">
          <label className="block text-[10px] uppercase tracking-[0.2em] text-white/40 font-mono mb-4">
            Security Intelligence // Live Radar
          </label>
          <h2 className="text-4xl md:text-5xl font-serif italic tracking-tight text-white leading-tight font-medium">
            Active Cyber Threat Intelligence & Safe Sandboxed Analytica.
          </h2>
          <p className="mt-4 text-[#A0A0A5] text-sm md:text-base leading-relaxed font-sans max-w-2xl">
            Protect high-value workflows from malicious vectors. Evaluate lookalike domain systems using heuristic rule matching powered by our core cybersecurity inspection suite.
          </p>
          <div className="mt-8 flex flex-wrap gap-6">
            <button
              onClick={() => setActiveTab('analyzer')}
              className="px-6 py-3 bg-white text-black font-semibold text-xs tracking-widest uppercase hover:bg-[#E0E0E0] transition-colors duration-150 inline-flex items-center gap-2 cursor-pointer rounded-none"
            >
              Analyze Target URL
            </button>
            <button
              onClick={() => setActiveTab('game')}
              className="px-6 py-3 border border-white/20 text-white font-semibold text-xs tracking-widest uppercase hover:bg-white/5 transition-colors duration-150 inline-flex items-center gap-2 cursor-pointer rounded-none"
            >
              Train Security Reflex
            </button>
          </div>
        </div>
      </div>

      {/* Stats Counters Grid - Massive Typographic Figures */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#0F0F11] border border-white/10 p-6 flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-[0.15em] text-white/40 font-mono block mb-2">
              Heuristics Assessed
            </span>
            <div className="text-5xl font-serif text-white font-semibold leading-none">
              {totalAnalyzed + directSubmissions}
            </div>
          </div>
          <div className="mt-6 text-[10px] text-white/40 font-mono uppercase tracking-wide">
            <span className="text-emerald-400 font-semibold">↑ 12.4% WEEKLY</span> // CALIBRATED
          </div>
        </div>

        <div className="bg-[#0F0F11] border border-white/10 p-6 flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-[0.15em] text-white/40 font-mono block mb-2">
              Threat Vectors Blocked
            </span>
            <div className="text-5xl font-serif text-rose-500 font-semibold leading-none">
              {highRiskBlocked}
            </div>
          </div>
          <div className="mt-6 text-[10px] text-rose-400 font-mono uppercase tracking-wide">
            CRITICAL NEUTRALIZATIONS ACTIVE
          </div>
        </div>

        <div className="bg-[#0F0F11] border border-white/10 p-6 flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-[0.15em] text-white/40 font-mono block mb-2">
              Broadcast Advisories
            </span>
            <div className="text-5xl font-serif text-white font-semibold leading-none">
              {liveAdvisories}
            </div>
          </div>
          <div className="mt-6 text-[10px] text-white/40 font-mono uppercase tracking-wide">
            LIVE FEEDS LOADED
          </div>
        </div>

        <div className="bg-[#0F0F11] border border-white/10 p-6 flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-[0.15em] text-white/40 font-mono block mb-2">
              Crowdsourced Reports
            </span>
            <div className="text-5xl font-serif text-emerald-400 font-semibold leading-none">
              {directSubmissions}
            </div>
          </div>
          <div className="mt-6 text-[10px] text-emerald-400 font-mono uppercase tracking-wide">
            VERIFIED SECURE TRANSMISSIONS
          </div>
        </div>
      </div>

      {/* Dual Column Layout: Threat Metrics Map & Recent Advisories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column blocks */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-[#0A0A0B] border border-white/10 p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline mb-8 gap-4">
              <div>
                <h3 className="text-xl font-serif italic text-white">Threat Indicators Distribution</h3>
                <p className="text-xs text-white/40 mt-1">Telemetry audit of standard phishing signature vectors</p>
              </div>
              <span className="text-[9px] border border-white/10 text-white/40 px-3 py-1 font-mono uppercase tracking-wider">
                LOG_ID: TELEMETRY_CLIENT
              </span>
            </div>

            {/* Custom Responsive Progress Distribution Component */}
            <div className="space-y-6 flex-1">
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-white/80 font-sans">Typosquatting & Lookalike Domains</span>
                  <span className="text-white/40 font-mono font-sans">42% // HIGH FREQUENCY</span>
                </div>
                <div className="w-full bg-white/5 h-1">
                  <div className="bg-rose-500 h-full" style={{ width: '42%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-white/80 font-sans">IP Address Embedded URLs (No Hostname)</span>
                  <span className="text-white/40 font-mono font-sans">18% // MITIGATED</span>
                </div>
                <div className="w-full bg-white/5 h-1">
                  <div className="bg-white/40 h-full" style={{ width: '18%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-white/80 font-sans">Unicode Homoglyph Spoilers (Lookalikes)</span>
                  <span className="text-white/40 font-mono font-sans">15% // CRITICAL INJECTIONS</span>
                </div>
                <div className="w-full bg-white/5 h-1">
                  <div className="bg-rose-500 h-full" style={{ width: '15%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-white/80 font-sans">Missing SSL Layer (HTTP Cleartext Channel)</span>
                  <span className="text-white/40 font-mono font-sans">25% // EXPOSED PASSWORDS</span>
                </div>
                <div className="w-full bg-[#0F0F11] h-1">
                  <div className="bg-rose-400 h-full" style={{ width: '25%' }}></div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-5 bg-[#0F0F11] border-l-2 border-rose-500 text-xs text-white/70 leading-relaxed font-serif italic">
              <strong>Interactive Cyber Defense:</strong> Threat hunting mechanisms parse Unicode scripts sequentially. Test a disguised lookalike domain such as <span className="bg-white/5 px-2 py-0.5 rounded text-rose-300 font-mono not-italic border border-white/5">http://g00gle.com/secure</span> in our input analyzer panel to evaluate the system.
            </div>
          </div>

          {/* Education Promotion Card */}
          <div className="bg-[#0F0F11] border border-white/10 p-8 flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-1 space-y-3">
              <label className="block text-[10px] uppercase tracking-[0.2em] text-emerald-400 font-mono">
                Training Academy // Interactive Module
              </label>
              <h3 className="text-2xl font-serif text-white italic">Train Employee and Desk Anti-Phishing Reflexes</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Phishing remains the single most dangerous initial entry vector in workspace intrusion setups. Our built-in simulator tests active defensive skills with <span className="text-white font-bold">{scenariosCount} realistic corporate phishing scenarios</span>.
              </p>
              <button
                onClick={() => setActiveTab('game')}
                className="mt-4 text-emerald-400 hover:text-emerald-300 text-xs font-semibold uppercase tracking-widest inline-flex items-center gap-2 cursor-pointer font-sans"
              >
                Launch training board <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right column: Recent Advisories */}
        <div className="space-y-6">
          <div className="bg-[#0F0F11] border border-white/10 p-6 flex flex-col h-full justify-between">
            <div>
              <div className="flex justify-between items-baseline mb-6 font-sans">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white font-sans">Live Threat Feed</h3>
                <button
                  onClick={() => setActiveTab('feed')}
                  className="text-[9px] text-white/40 hover:text-white uppercase tracking-wider font-semibold cursor-pointer border-b border-white/25 font-sans"
                >
                  View All
                </button>
              </div>

              <div className="space-y-6 divide-y divide-white/5">
                {newsList.slice(0, 3).map((item) => (
                  <article key={item.id} className="pt-5 first:pt-0">
                    <div className="flex justify-between items-baseline mb-2">
                      <span className={`text-[8px] uppercase font-mono tracking-widest font-semibold ${
                        item.severity === 'Critical' ? 'text-rose-500' :
                        item.severity === 'High' ? 'text-rose-400' :
                        item.severity === 'Medium' ? 'text-amber-400' :
                        'text-white/40'
                      }`}>
                        {item.severity} // SEVERITY
                      </span>
                      <time className="text-[9px] text-[#A0A0A5] font-mono">
                        {new Date(item.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }).toUpperCase()}
                      </time>
                    </div>
                    <h4 className="text-sm font-serif italic text-white leading-snug hover:text-rose-200 transition duration-150">
                      {item.title}
                    </h4>
                    <p className="text-xs text-white/40 mt-1 line-clamp-2 leading-relaxed font-sans">
                      {item.summary}
                    </p>
                  </article>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/5 text-[10px] text-white/30 font-mono uppercase tracking-wider">
              Feeds refreshed live.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
