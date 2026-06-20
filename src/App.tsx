import { useState } from 'react';
import { Shield, Radio, Award, Cpu, BookOpen, Menu, X, ArrowRight, Github, Info, Lock } from 'lucide-react';
import { NewsItem, ThreatReport } from './types';
import { INITIAL_NEWS } from './data/news-data';
import Dashboard from './components/Dashboard';
import Analyzer from './components/Analyzer';
import ThreatIntel from './components/ThreatIntel';
import PhishGame from './components/PhishGame';
import { GAME_SCENARIOS } from './data/game-scenarios';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [news, setNews] = useState<NewsItem[]>(INITIAL_NEWS);
  const [reports, setReports] = useState<ThreatReport[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleAddNews = (item: NewsItem) => {
    setNews((prev) => [item, ...prev]);
  };

  const handleAddReport = (report: ThreatReport) => {
    setReports((prev) => [report, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#E0E0E0] flex flex-col font-sans selection:bg-rose-500 selection:text-black">
      
      {/* Upper security alert ribbon */}
      <div className="bg-[#0F0F11] border-b border-white/10 text-center py-2.5 px-4 flex items-center justify-center gap-2">
        <span className="flex h-1.5 w-1.5 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-500"></span>
        </span>
        <span className="text-[10px] font-mono tracking-widest text-white/60 uppercase">
          SECURE PROTOCOL // ALL INCOMING SCANS ARE ISOLATED IN AUTOMATED THREAT SANDBOXES
        </span>
      </div>

      {/* Main Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#0A0A0B]/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-baseline h-20">
            
            {/* Logo Group */}
            <div 
              className="flex items-baseline gap-4 cursor-pointer"
              onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
            >
              <span className="text-3xl font-serif italic tracking-tight text-white">
                SecuriFeed
              </span>
            </div>

            {/* Desktop Navigation Link buttons */}
            <nav className="hidden md:flex items-baseline gap-8 text-[11px] uppercase tracking-widest font-semibold font-mono">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`py-1 transition duration-150 cursor-pointer ${
                  activeTab === 'dashboard' 
                    ? 'text-white border-b border-white' 
                    : 'text-white/40 hover:text-white'
                }`}
              >
                Dashboard
              </button>
              
              <button
                onClick={() => setActiveTab('analyzer')}
                className={`py-1 transition duration-150 cursor-pointer ${
                  activeTab === 'analyzer' 
                    ? 'text-white border-b border-white' 
                    : 'text-white/40 hover:text-white'
                }`}
              >
                Analyzer
              </button>

              <button
                onClick={() => setActiveTab('feed')}
                className={`py-1 transition duration-150 cursor-pointer ${
                  activeTab === 'feed' 
                    ? 'text-white border-b border-slate-200' 
                    : 'text-white/40 hover:text-white'
                }`}
              >
                Intelligence Feed
              </button>

              <button
                onClick={() => setActiveTab('game')}
                className={`py-1 transition duration-150 cursor-pointer ${
                  activeTab === 'game' 
                    ? 'text-emerald-400 border-b border-emerald-400' 
                    : 'text-white/40 hover:text-white'
                }`}
              >
                Academy Game
              </button>
            </nav>

            {/* Right Quick widgets */}
            <div className="hidden lg:flex items-center gap-3">
              <div className="text-[9px] text-emerald-400 border border-emerald-500/20 bg-emerald-500/5 py-1 px-3 rounded-none font-mono uppercase tracking-widest">
                ● SSL Guard Stable
              </div>
            </div>

            {/* Mobile menu hamburger button */}
            <div className="md:hidden flex items-center h-full">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 bg-white/5 border border-white/10 rounded-sm text-white/60 hover:text-white cursor-pointer"
                aria-label="Toggle Navigation Options"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0F0F11] border-b border-white/10 px-6 py-5 space-y-3 animate-fade-in font-mono text-[10px] uppercase tracking-widest">
            <button
              onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
              className={`w-full text-left py-2 flex items-center justify-between ${
                activeTab === 'dashboard' ? 'text-white font-bold' : 'text-white/40'
              }`}
            >
              <span>Dashboard Overview</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => { setActiveTab('analyzer'); setMobileMenuOpen(false); }}
              className={`w-full text-left py-2 flex items-center justify-between ${
                activeTab === 'analyzer' ? 'text-white font-bold' : 'text-white/40'
              }`}
            >
              <span>Suspicious Link Analyzer</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => { setActiveTab('feed'); setMobileMenuOpen(false); }}
              className={`w-full text-left py-2 flex items-center justify-between ${
                activeTab === 'feed' ? 'text-white font-bold' : 'text-white/40'
              }`}
            >
              <span>Live Threat Intelligence</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => { setActiveTab('game'); setMobileMenuOpen(false); }}
              className={`w-full text-left py-2 flex items-center justify-between ${
                activeTab === 'game' ? 'text-emerald-400 font-bold' : 'text-white/40'
              }`}
            >
              <span>Academy reflex game</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </header>

      {/* Main Workspace Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 lg:px-8 py-10">
        {activeTab === 'dashboard' && (
          <Dashboard 
            newsList={news} 
            threatReports={reports} 
            setActiveTab={setActiveTab} 
            scenariosCount={GAME_SCENARIOS.length}
          />
        )}
        {activeTab === 'analyzer' && <Analyzer />}
        {activeTab === 'feed' && (
          <ThreatIntel 
            newsList={news} 
            threatReports={reports} 
            onAddNews={handleAddNews} 
            onAddReport={handleAddReport}
          />
        )}
        {activeTab === 'game' && <PhishGame />}
      </main>



    </div>
  );
}
