import { useState } from 'react';
import { Award, Zap, CheckCircle, XCircle, RotateCcw, AlertTriangle, ShieldCheck, Globe, Flame } from 'lucide-react';
import { GameScenario, UserStats } from '../types';
import { GAME_SCENARIOS } from '../data/game-scenarios';

export default function PhishGame() {
  const [scenarios, setScenarios] = useState<GameScenario[]>(GAME_SCENARIOS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [selectedAns, setSelectedAns] = useState<boolean | null>(null);
  const [stats, setStats] = useState<UserStats>({
    score: 0,
    streak: 0,
    levelsCompleted: 1,
    totalAnswered: 0,
    correctAnswers: 0,
  });

  const [isGameFinished, setIsGameFinished] = useState(false);

  const activeScenario = scenarios[currentIndex];

  const handleDecision = (userSelectedPhishing: boolean) => {
    if (hasAnswered) return;

    setHasAnswered(true);
    setSelectedAns(userSelectedPhishing);

    const isCorrect = userSelectedPhishing === activeScenario.isPhishing;
    const additionalScore = isCorrect ? (activeScenario.difficulty === 'hard' ? 25 : activeScenario.difficulty === 'medium' ? 15 : 10) : 0;

    setStats((prev) => {
      const nextStreak = isCorrect ? prev.streak + 1 : 0;
      const nextScore = prev.score + additionalScore;
      const nextLevel = Math.max(prev.levelsCompleted, Math.floor(nextScore / 50) + 1);
      
      return {
        score: nextScore,
        streak: nextStreak,
        levelsCompleted: nextLevel,
        totalAnswered: prev.totalAnswered + 1,
        correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
      };
    });
  };

  const handleNext = () => {
    setHasAnswered(false);
    setSelectedAns(null);

    if (currentIndex + 1 < scenarios.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsGameFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setHasAnswered(false);
    setSelectedAns(null);
    setIsGameFinished(false);
    setStats({
      score: 0,
      streak: 0,
      levelsCompleted: 1,
      totalAnswered: 0,
      correctAnswers: 0,
    });
  };

  return (
    <div className="space-y-12 animate-fade-in max-w-5xl mx-auto">
      
      {/* Editorial Title Block */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-baseline border-b border-white/10 pb-8 gap-6">
        <div>
          <label className="text-[10px] uppercase tracking-[0.25em] text-white/40 font-mono block mb-2">
            Workspace Academy // Reflex Board
          </label>
          <h2 className="text-3xl md:text-4xl font-serif italic text-white font-medium">
            PhishDetect Reflex Simulator training.
          </h2>
          <p className="text-[#A0A0A5] text-sm mt-2 max-w-2xl leading-relaxed">
            Strengthen standard employee firewalls. Spot typosquatting subdomains, Homoglyph Unicode spoofs, cleartext HTTP credentials inputs, or high-urgency business emails.
          </p>
        </div>

        {/* Stats track list */}
        <div className="flex flex-wrap gap-4 font-mono uppercase tracking-widest text-[9px] text-[#A0A0A5]">
          <div className="bg-[#0F0F11] border border-white/10 py-2 px-4">
            LEVEL: <span className="text-white font-bold">0{stats.levelsCompleted}</span>
          </div>
          <div className="bg-[#0F0F11] border border-white/10 py-2 px-4 flex items-center gap-1">
            SCORE: <span className="text-emerald-400 font-bold">{stats.score}</span> <span className="text-white/20">//</span> XP
          </div>
          <div className="bg-[#0F0F11] border border-white/10 py-2 px-4 flex items-center gap-1">
            STREAK: <span className="text-rose-500 font-bold">{stats.streak}</span> <Flame className="w-3 h-3 text-rose-500 inline" />
          </div>
        </div>
      </div>

      {isGameFinished ? (
        /* Results screen */
        <div className="bg-[#0F0F11] border border-white/10 p-12 max-w-2xl mx-auto text-center space-y-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 -mr-12 -mt-12 w-48 h-48 bg-rose-500/5 rounded-full blur-3xl"></div>
          
          <div className="inline-flex p-4 bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 rounded-none">
            <ShieldCheck className="w-12 h-12" />
          </div>

          <div className="space-y-2">
            <h3 className="text-3xl font-serif italic text-white font-medium">Reflex Deck Fully Evaluated.</h3>
            <p className="text-[#A0A0A5] text-xs uppercase tracking-widest font-mono">Telemetry check and safety diagnostic metrics:</p>
          </div>

          <div className="grid grid-cols-2 gap-6 bg-black/60 p-6 border border-white/10 font-mono text-xs">
            <div className="p-4 border-r border-white/10">
              <span className="text-white/40 block mb-2 uppercase tracking-widest text-[9px]">Decision Accuracy</span>
              <strong className="text-3xl font-bold text-emerald-400">
                {stats.totalAnswered > 0 ? Math.round((stats.correctAnswers / stats.totalAnswered) * 100) : 0}%
              </strong>
            </div>
            <div className="p-4">
              <span className="text-white/40 block mb-2 uppercase tracking-widest text-[9px]">Total Points Accrued</span>
              <strong className="text-3xl font-bold text-white">{stats.score} XP</strong>
            </div>
          </div>

          <div className="text-sm text-[#A0A0A5] max-w-lg mx-auto leading-relaxed italic font-serif">
            {stats.correctAnswers === stats.totalAnswered ? (
              <span>"Absolute digital vigilance! You spotted every single homoglyph spoof and malicious attachment vector without raising false notifications. Standard Security Officer qualification."</span>
            ) : stats.correctAnswers >= stats.totalAnswered * 0.75 ? (
              <span>"A highly responsive human firewall. You accurately flagged critical domain spoofs, but some complex character lookalikes or structural tricks bypassed your check. Continued practice recommended."</span>
            ) : (
              <span>"Security advisory active: Critical vulnerability threshold detected. Multiple trademark typosquatting variations and cleartext SMS intercepts successfully tricked your evaluations. Review our vigilance checklist."</span>
            )}
          </div>

          <div className="pt-4">
            <button
              onClick={handleRestart}
              className="px-6 py-3 bg-white text-black font-semibold text-xs tracking-widest uppercase hover:bg-neutral-200 transition-colors rounded-none cursor-pointer"
            >
              Restart Academy Course
            </button>
          </div>
        </div>
      ) : (
        /* Active quiz layout */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main workspace container */}
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-[#0F0F11] border border-white/10 px-6 py-4 flex justify-between items-baseline text-[10px] font-mono uppercase tracking-wider text-white/50">
              <span>
                DECK SEQUENCE: <span className="text-white font-bold font-mono">0{currentIndex + 1}</span> / 0{scenarios.length}
              </span>
              <span className={`px-2 py-0.5 border ${
                activeScenario.difficulty === 'hard' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                activeScenario.difficulty === 'medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              }`}>
                DIFFICULTY // {activeScenario.difficulty}
              </span>
            </div>

            {/* Simulated Desktop/Device workspace block */}
            <div className="bg-[#0F0F11] border border-white/10 overflow-hidden relative">
              
              {/* Device bar */}
              <div className="bg-black/60 px-5 py-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex gap-2">
                  <span className="w-2.5 h-2.5 bg-rose-500/50 rounded-full"></span>
                  <span className="w-2.5 h-2.5 bg-amber-500/50 rounded-full"></span>
                  <span className="w-2.5 h-2.5 bg-emerald-500/50 rounded-full"></span>
                </div>
                
                <span className="text-[10px] uppercase tracking-widest text-[#A0A0A5] font-mono">
                  {activeScenario.type === 'url' ? 'Hostname Inspection' : (activeScenario.type === 'email' ? 'Workspace Mail client' : 'Secure SMS network')}
                </span>
              </div>

              {/* Main Canvas Area */}
              <div className="p-8 bg-black/30 min-h-[220px] text-white flex flex-col justify-between">
                
                {activeScenario.type === 'email' && (
                  <div className="space-y-6">
                    <div className="border-b border-white/5 pb-4 space-y-2 text-xs font-mono">
                      <div>
                        <span className="text-white/40 uppercase tracking-widest text-[9px] mr-2">Sender address:</span>
                        <code className="text-rose-300 font-semibold font-mono bg-white/5 px-2 py-1 border border-white/10 select-all font-mono">{activeScenario.senderOrDomain}</code>
                      </div>
                      <div>
                        <span className="text-white/40 uppercase tracking-widest text-[9px] mr-2">Subject header:</span>
                        <span className="text-white font-sans">{activeScenario.subjectOrUrl}</span>
                      </div>
                    </div>
                    <div className="p-6 bg-white/5 border border-white/10 text-xs md:text-sm text-white/80 whitespace-pre-line leading-relaxed font-sans font-medium">
                      {activeScenario.content}
                    </div>
                  </div>
                )}

                {activeScenario.type === 'sms' && (
                  <div className="max-w-md mx-auto w-full bg-black/60 border border-white/10 p-5 space-y-4">
                    <div className="flex justify-between items-center text-[9px] text-[#A0A0A5] font-mono uppercase tracking-widest pb-2 border-b border-white/5">
                      <span>Sender: {activeScenario.senderOrDomain}</span>
                      <span>SMS Broadcast</span>
                    </div>
                    <div className="p-4 bg-white/5 border border-white/10 text-xs text-white/90 leading-relaxed font-mono">
                      {activeScenario.content}
                    </div>
                  </div>
                )}

                {activeScenario.type === 'url' && (
                  <div className="space-y-6 py-4 text-center">
                    <div className="inline-flex p-4 bg-black/60 border border-white/10">
                      <Globe className="w-8 h-8 text-rose-500" />
                    </div>
                    <div className="space-y-2 max-w-xl mx-auto">
                      <label className="text-[9px] text-white/40 font-mono uppercase tracking-[0.2em] block">Lookalike Domain Evaluated</label>
                      <code className="block bg-black/60 p-4 text-sm text-rose-300 font-mono break-all border border-white/10 select-all leading-normal">{activeScenario.subjectOrUrl}</code>
                    </div>
                    <p className="text-xs text-white/60 leading-relaxed max-w-md mx-auto">
                      {activeScenario.content}
                    </p>
                  </div>
                )}

              </div>

              {/* Action buttons bar */}
              <div className="bg-black/60 p-4 border-t border-white/10 flex flex-col sm:flex-row gap-4">
                <button
                  disabled={hasAnswered}
                  onClick={() => handleDecision(false)}
                  className={`px-6 py-4 text-xs font-semibold uppercase tracking-widest transition-colors duration-150 rounded-none cursor-pointer flex-1 justify-center inline-flex items-center gap-2 ${
                    hasAnswered
                      ? 'bg-transparent text-white/20 border border-white/5'
                      : 'bg-[#0F0F11] text-white border border-white/20 hover:bg-white hover:text-black'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  Mark Safe
                </button>

                <button
                  disabled={hasAnswered}
                  onClick={() => handleDecision(true)}
                  className={`px-6 py-4 text-xs font-semibold uppercase tracking-widest transition-colors duration-150 rounded-none cursor-pointer flex-1 justify-center inline-flex items-center gap-2 ${
                    hasAnswered
                      ? 'bg-transparent text-white/20 border border-white/5'
                      : 'bg-rose-500 text-white hover:bg-rose-600'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4" />
                  Mark Phishing
                </button>
              </div>

            </div>

            {/* Answer Feedbacks Panel */}
            {hasAnswered && (
              <div className={`p-8 border animate-fade-in space-y-6 ${
                (selectedAns === activeScenario.isPhishing)
                  ? 'bg-emerald-500/5 border-emerald-500/20'
                  : 'bg-rose-500/5 border-rose-500/20'
              }`}>
                
                <div className="flex flex-col sm:flex-row justify-between sm:items-baseline gap-2 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    {selectedAns === activeScenario.isPhishing ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                        <span className="text-sm font-bold uppercase tracking-wider text-white font-mono">
                          Decision Checked Correct! (+{activeScenario.difficulty === 'hard' ? 25 : activeScenario.difficulty === 'medium' ? 15 : 10} XP)
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-rose-500" />
                        <span className="text-sm font-bold uppercase tracking-wider text-white font-mono">
                          Firewall Breeched!
                        </span>
                      </>
                    )}
                  </div>
                  
                  <span className={`text-[9px] font-mono px-3 py-1 border uppercase font-bold tracking-widest ${
                    activeScenario.isPhishing ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  }`}>
                    {activeScenario.isPhishing ? 'Phishing Attempt' : 'Legitimate Asset'}
                  </span>
                </div>

                {activeScenario.isPhishing && activeScenario.phishingIndicators.length > 0 && (
                  <div className="space-y-3">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#A0A0A5] block">Malicious signatures identified in this file:</span>
                    <ul className="space-y-2">
                      {activeScenario.phishingIndicators.map((ind, i) => (
                        <li key={i} className="text-xs text-rose-400 bg-rose-500/5 border border-rose-500/10 p-3 font-mono leading-relaxed flex gap-2">
                          <span className="text-white/30">[{i+1}]</span>
                          <span>{ind}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#A0A0A5] block">Simulation Advisory study notes:</span>
                  <p className="text-sm text-white/80 leading-relaxed font-serif italic">{activeScenario.explanation}</p>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleNext}
                    className="px-6 py-3 bg-white text-black font-semibold text-xs tracking-widest uppercase hover:bg-neutral-200 transition-colors rounded-none inline-flex items-center gap-2 cursor-pointer font-sans"
                  >
                    Next Scenario
                  </button>
                </div>

              </div>
            )}

          </div>

          {/* Right column */}
          <div className="space-y-6">
            <div className="bg-[#0F0F11] border border-white/10 p-6 space-y-6">
              <h3 className="text-xs font-bold font-mono text-white uppercase tracking-widest flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-400" />
                Vigilance Field Notes
              </h3>
              
              <ul className="space-y-6 text-xs text-white/70 leading-relaxed font-sans">
                <li className="space-y-2">
                  <strong className="text-white font-mono text-[10px] uppercase tracking-widest block border-b border-white/5 pb-1">01 / Lookalike ASCII keys</strong>
                  <p className="text-white/60">
                    Always evaluate subdomain depth structures. Scam domains append trusted brand words at the front like <code className="bg-white/5 px-1 pb-0.5 font-mono text-[10px] text-rose-300">paypal.login-secure.xyz</code>, masquerading as official targets.
                  </p>
                </li>

                <li className="space-y-2">
                  <strong className="text-white font-mono text-[10px] uppercase tracking-widest block border-b border-white/5 pb-1">02 / Artificial Urgency</strong>
                  <p className="text-white/60">
                    Legitimate banking, social desk, and developer portals rarely request instant action inside tight hours window (e.g. "Locked in 4 hours") without previous official warnings.
                  </p>
                </li>

                <li className="space-y-2">
                  <strong className="text-white font-mono text-[10px] uppercase tracking-widest block border-b border-white/5 pb-1">03 / Homoglyph lookalikes</strong>
                  <p className="text-white/60">
                    Modern phishing utilizes Cyrillic alphabet characters to mimic valid characters (e.g. "а" instead of "a"). Double check domain text copy strings inside the SecuriFeed analyzer.
                  </p>
                </li>
              </ul>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
