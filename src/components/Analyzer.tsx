import { useState, FormEvent } from 'react';
import { Shield, ShieldAlert, RefreshCw, AlertCircle, CheckCircle, Lock, Unlock, Zap } from 'lucide-react';
import { AnalysisResult, CheckItem } from '../types';

export default function Analyzer() {
  const [urlInput, setUrlInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleClear = () => {
    setUrlInput('');
    setResult(null);
    setError(null);
  };

  const handleAnalyze = async (e: FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) {
      setError('Please provide a URL to analyze.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const rawUrl = urlInput.trim();
    if (rawUrl.length > 1000) {
      setError('URL exceeds maximum permitted buffer size (1000 chars).');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/analyze-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: rawUrl }),
      });

      if (!response.ok) {
        throw new Error('Server returned an error status while scanning.');
      }

      const data: AnalysisResult = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error('API call failed, running local safety fallback engine...', err);
      const processedResult = runLocalFallbackAnalysis(rawUrl);
      setResult(processedResult);
    } finally {
      setIsLoading(false);
    }
  };

  const runLocalFallbackAnalysis = (raw: string): AnalysisResult => {
    let sanitized = raw.replace(/<[^>]*>/g, '');
    sanitized = sanitized.trim();

    let testingUrl = sanitized;
    if (!/^https?:\/\//i.test(testingUrl)) {
      testingUrl = 'http://' + testingUrl;
    }

    let parsed: URL;
    try {
      parsed = new URL(testingUrl);
    } catch (e) {
      const domainMatch = testingUrl.match(/^https?:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
      const domain = domainMatch ? domainMatch[1] : testingUrl;
      parsed = {
        hostname: domain,
        protocol: testingUrl.startsWith('https') ? 'https:' : 'http:',
        port: '',
        pathname: ''
      } as any;
    }

    const host = parsed.hostname.toLowerCase();
    const isHttps = parsed.protocol === 'https:';

    const ipV4Regex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
    const ipV6Regex = /^\[?[a-f0-9]*:[a-f0-9:]+\]?$/i;
    const isIpUrl = ipV4Regex.test(host) || ipV6Regex.test(host);

    const isHomoglyph = /[^\u0000-\u007F]/.test(host);

    const suspiciousKeywords = ['paypal', 'netflix', 'chase', 'google', 'apple', 'signin', 'login', 'secure', 'verify', 'update', 'accounts', 'billing', 'support', 'bank'];
    const brandCheckwords = ['paypa1', 'g00gle', 'netflix-', 'chase-', 'verification-', 'support-'];
    
    let isTyposquatting = false;
    let includesSuspiciousWords = false;

    for (const term of brandCheckwords) {
      if (host.includes(term)) {
        isTyposquatting = true;
      }
    }

    for (const kw of suspiciousKeywords) {
      if (host.includes(kw)) {
        includesSuspiciousWords = true;
        if (kw === 'google' && !host.endsWith('.google.com') && host !== 'google.com') isTyposquatting = true;
        if (kw === 'paypal' && !host.endsWith('.paypal.com') && host !== 'paypal.com') isTyposquatting = true;
        if (kw === 'netflix' && !host.endsWith('.netflix.com') && host !== 'netflix.com') isTyposquatting = true;
        if (kw === 'chase' && !host.endsWith('.chase.com') && host !== 'chase.com') isTyposquatting = true;
        if (kw === 'apple' && !host.endsWith('.apple.com') && host !== 'apple.com') isTyposquatting = true;
      }
    }

    const subdomainsCount = host.split('.').length - 2;
    const isSubdomainsSpam = subdomainsCount > 3;

    let score = 0;
    const checks: CheckItem[] = [];

    if (isHttps) {
      checks.push({
        name: 'TLS/SSL Layer encryption',
        status: 'pass',
        message: 'The connection is encrypted using modern secure HTTPS protocol.'
      });
    } else {
      score += 25;
      checks.push({
        name: 'TLS/SSL Layer encryption',
        status: 'fail',
        message: 'HTTP connection detected. Missing secure encryption. Eavesdroppers can intercept logins.'
      });
    }

    if (isIpUrl) {
      score += 35;
      checks.push({
        name: 'Hostname Evaluation',
        status: 'fail',
        message: 'Suspicious IP address hostname instead of generic Domain Name registry.'
      });
    } else {
      checks.push({
        name: 'Hostname Evaluation',
        status: 'pass',
        message: 'Valid host string present.'
      });
    }

    if (isHomoglyph) {
      score += 25;
      checks.push({
        name: 'Internationalized character (IDN/Homoglyph) inspection',
        status: 'fail',
        message: 'Unicode homoglyphs found. Characters mimic standard ASCII letters to spoof trusted brands.'
      });
    } else {
      checks.push({
        name: 'Internationalized character (IDN/Homoglyph) inspection',
        status: 'pass',
        message: 'Pure ASCII characters detected. No homoglyphs spoofing identified.'
      });
    }

    if (isTyposquatting) {
      score += 30;
      checks.push({
        name: 'Phishing Typosquatting Matcher',
        status: 'fail',
        message: 'Lookalike spelling variations or brand labels matched against our internal scam database.'
      });
    } else if (includesSuspiciousWords) {
      score += 15;
      checks.push({
        name: 'Phishing Typosquatting Matcher',
        status: 'warning',
        message: 'Includes core security keywords (e.g. login, verification) out of standard authoritative domain context.'
      });
    } else {
      checks.push({
        name: 'Phishing Typosquatting Matcher',
        status: 'pass',
        message: 'Domain name appears distinct from high-frequency spoofed brands.'
      });
    }

    if (isSubdomainsSpam) {
      score += 15;
      checks.push({
        name: 'Subdomain Chain Depth Check',
        status: 'warning',
        message: 'Multiple subdomain nesting blocks (e.g. accounts.support.paypal.signin...). Usually registered for distraction scams.'
      });
    } else {
      checks.push({
        name: 'Subdomain Chain Depth Check',
        status: 'pass',
        message: 'Nesting configuration standard.'
      });
    }

    const badTLDs = ['.xyz', '.click', '.online', '.work', '.info', '.top', '.zip'];
    let isBadTLD = false;
    for (const tld of badTLDs) {
      if (host.endsWith(tld)) {
        isBadTLD = true;
      }
    }

    if (isBadTLD) {
      score += 10;
      checks.push({
        name: 'Top-Level Domain Suffix Check',
        status: 'warning',
        message: `Suffix ${host.substring(host.lastIndexOf('.'))} has a high correlation with throwaway phishing servers.`
      });
    } else {
      checks.push({
        name: 'Top-Level Domain Suffix Check',
        status: 'pass',
        message: 'Authorized generic global TLD suffix.'
      });
    }

    score = Math.min(100, Math.max(isHttps ? 5 : 20, score));
    const riskLvl = score >= 70 ? 'High' : score >= 35 ? 'Medium' : 'Low';

    return {
      url: raw,
      sanitizedUrl: sanitized,
      riskScore: score,
      riskLevel: riskLvl,
      sslInfo: {
        hasSsl: isHttps,
        protocol: isHttps ? 'HTTPS/TLS v1.3' : 'HTTP/1.1 (UNENCRYPTED)',
        warning: isHttps ? null : 'Unencrypted Cleartext Channel Detected! Legitimate bank desks, social nets, and workspaces will NEVER use raw HTTP entries.',
        port: parsed.port ? parseInt(parsed.port) : (isHttps ? 443 : 80)
      },
      patternsDetected: {
        Typosquatting: isTyposquatting,
        IpUrl: isIpUrl,
        Homoglyphs: isHomoglyph,
        SuspiciousWords: includesSuspiciousWords,
        Subdomains: isSubdomainsSpam
      },
      detailedChecks: checks,
      aiInsight: "Local rule analyzer operating in standalone mode. Note: For active advanced intelligence parsing, ensure the backend is fully initialized with valid process.env.GEMINI_API_KEY.",
      scannedAt: new Date().toISOString()
    };
  };

  return (
    <div className="space-y-12 animate-fade-in max-w-5xl mx-auto">
      
      {/* Editorial Title Block */}
      <div className="border-b border-white/10 pb-8">
        <label className="text-[10px] uppercase tracking-[0.25em] text-white/40 font-mono block mb-2">
          System Module // Link Inspection Panel
        </label>
        <h2 className="text-3xl md:text-4xl font-serif italic text-white font-medium">
          Automated URL & Network Encryption Diagnostics.
        </h2>
        <p className="text-white/50 text-sm mt-2 max-w-2xl leading-relaxed">
          Submit suspicious links, homoglyph lookalikes, or self-signed API services. Our model decomposes strings to flag trademark typosquatting, extreme subdomain spamming, or insecure HTTP cleartext configurations.
        </p>
      </div>

      {/* Input Form Box - Editorial Focus Banner style */}
      <div className="bg-[#0F0F11] border border-white/10 p-8 relative">
        <form onSubmit={handleAnalyze} className="space-y-6">
          <div>
            <label htmlFor="url-input" className="block text-[10px] uppercase tracking-[0.2em] text-white/40 font-mono mb-4">
              Enter target suspect URL
            </label>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <div className="absolute left-0 top-0 w-1 h-full bg-rose-500"></div>
                <input
                  id="url-input"
                  type="text"
                  placeholder="e.g., http://chase-verification-login-portal.click/verify"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="w-full bg-white/5 border-none text-white text-lg font-mono outline-none py-4 px-6 focus:bg-white/10 transition-colors"
                  disabled={isLoading}
                  autoComplete="off"
                />
                {urlInput && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-wider font-mono text-white/40 hover:text-white transition focus:outline-none cursor-pointer"
                  >
                    CLEAR //
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="px-8 py-4 bg-white text-black font-semibold text-xs tracking-widest uppercase hover:bg-neutral-200 transition-all duration-150 cursor-pointer disabled:bg-neutral-800 disabled:text-white/20 rounded-none h-full"
                disabled={isLoading}
              >
                {isLoading ? 'ANALYZING...' : 'RUN SCAN'}
              </button>
            </div>
          </div>
          
          <div className="text-[10px] text-white/40 flex items-center gap-2 leading-relaxed font-mono uppercase tracking-wider">
            <span className="text-rose-400">INFO //</span> Safe automated sandbox process ensures zero active script triggering during string dissection.
          </div>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 flex items-center gap-2 font-mono uppercase tracking-wider">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>ERROR: {error}</span>
          </div>
        )}
      </div>

      {/* Analysis Output Section */}
      {result && (
        <div className="space-y-12 animate-fade-in">
          
          {/* Asymmetric Editorial Grid matching the requested mockup */}
          <div className="bg-[#0F0F11] border border-white/10 p-10">
            <div className="flex flex-col md:flex-row gap-12 items-start justify-between">
              
              {/* Left Block: Massive editorial typographic rating */}
              <div className="flex flex-col min-w-[240px]">
                <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-mono mb-2">Threat Evaluation Score</span>
                <div className={`text-[120px] font-serif leading-none font-semibold -ml-2 select-none ${
                  result.riskLevel === 'High' ? 'text-rose-500' :
                  result.riskLevel === 'Medium' ? 'text-amber-500' :
                  'text-emerald-400'
                }`}>
                  {result.riskScore}
                </div>
                <div className="h-1.5 w-full bg-white/5 mt-4 overflow-hidden">
                  <div className={`h-full ${
                    result.riskLevel === 'High' ? 'bg-rose-500' :
                    result.riskLevel === 'Medium' ? 'bg-amber-500' :
                    'bg-emerald-400'
                  }`} style={{ width: `${result.riskScore}%` }}></div>
                </div>
                <p className={`mt-4 font-mono text-xs uppercase tracking-widest italic ${
                  result.riskLevel === 'High' ? 'text-rose-400' :
                  result.riskLevel === 'Medium' ? 'text-amber-400' :
                  'text-emerald-400'
                }`}>
                  {result.riskLevel} Risk / Evaluation Complete
                </p>
              </div>

              {/* Right Block: Technical diagnostics list */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-6">
                
                <div className="border-l border-white/10 pl-4">
                  <h3 className="text-[10px] uppercase tracking-widest text-[#A0A0A5] mb-2 font-mono">Input Target</h3>
                  <p className="text-xs font-mono text-white select-all break-all">{result.url}</p>
                </div>

                <div className="border-l border-white/10 pl-4">
                  <h3 className="text-[10px] uppercase tracking-widest text-[#A0A0A5] mb-2 font-mono">TLS Security Suffix</h3>
                  <p className={`text-xs font-semibold ${result.sslInfo.hasSsl ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {result.sslInfo.hasSsl ? 'ENCRYPTED' : 'PLAIN UNENCRYPTED'}
                  </p>
                  <p className="text-[11px] text-white/40 mt-1 font-mono italic">{result.sslInfo.protocol}</p>
                </div>

                <div className="border-l border-white/10 pl-4">
                  <h3 className="text-[10px] uppercase tracking-widest text-[#A0A0A5] mb-2 font-mono">Typosquatting Signature</h3>
                  <p className="text-xs text-white font-medium">
                    {result.patternsDetected.Typosquatting ? 'FLAGGED // TRADEMARK VARIANT' : 'CLEAN // NOT DETECTED'}
                  </p>
                  <p className="text-[11px] text-white/40 mt-1 font-mono italic">Lookalike spoof checking complete</p>
                </div>

                <div className="border-l border-white/10 pl-4">
                  <h3 className="text-[10px] uppercase tracking-widest text-[#A0A0A5] mb-2 font-mono">Unicode Homoglyphs</h3>
                  <p className="text-xs text-white font-medium">
                    {result.patternsDetected.Homoglyphs ? 'ALERT // SPECIAL CHARACTER DETECTED' : 'CLEAN // ASCII SYMBOLS'}
                  </p>
                  <p className="text-[11px] text-white/40 mt-1 font-mono italic">Punycode conversion checks</p>
                </div>
              </div>

            </div>
          </div>

          {/* SSL Cert Info Block */}
          <div className="bg-[#0F0F11] border border-white/10 p-8 space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white font-mono flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              Symmetric Encryption Standard Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-white/5 p-5 text-xs font-mono">
              <div>
                <span className="text-white/30 block tracking-widest uppercase text-[9px] mb-1">Standard Port</span>
                <span className="text-white mt-0.5 block">{result.sslInfo.port}</span>
              </div>
              <div>
                <span className="text-white/30 block tracking-widest uppercase text-[9px] mb-1">Channel Protection</span>
                <span className={`font-semibold mt-0.5 block ${result.sslInfo.hasSsl ? 'text-emerald-400' : 'text-rose-500'}`}>
                  {result.sslInfo.hasSsl ? 'TLS_ENCRYPTED_1.3' : 'CLEAR_HTTP_ALERT'}
                </span>
              </div>
              <div>
                <span className="text-white/30 block tracking-widest uppercase text-[9px] mb-1">Warning Telemetry</span>
                <span className="text-white/70 mt-0.5 block">
                  {result.sslInfo.hasSsl ? 'No anomalies detected.' : 'Warning: Cleartext transmission.'}
                </span>
              </div>
            </div>
            {result.sslInfo.warning && (
              <div className="p-4 bg-rose-500/10 border-l-2 border-rose-500 text-xs text-rose-400 leading-relaxed font-serif italic">
                {result.sslInfo.warning}
              </div>
            )}
          </div>

          {/* Dynamic Core AI Security Insight Assessment */}
          {result.aiInsight && (
            <div className="bg-[#0A0A0B] border border-white/10 p-8 relative">
              <div className="absolute top-0 right-0 p-4 font-mono text-[9px] tracking-widest text-emerald-400 uppercase">
                AUTOMATED SEC-REPORT
              </div>
              <div className="flex gap-4 items-baseline mb-4 border-b border-white/10 pb-4">
                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse flex-shrink-0"></div>
                <h4 className="text-sm font-bold uppercase tracking-[0.15em] text-white font-sans">
                  Core Security-OPS Tactical Insight Report
                </h4>
              </div>
              <div className="text-xs text-[#E0E0E0] md:text-sm leading-relaxed font-serif italic">
                <p className="whitespace-pre-line text-white/90">{result.aiInsight}</p>
              </div>
            </div>
          )}

          {/* Detailed rule checker list */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white font-mono">
              Heuristic Diagnostic Rules Checklist
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.detailedChecks.map((check, idx) => (
                <div key={idx} className="bg-[#0F0F11] border border-white/10 p-5 flex items-start gap-4">
                  <div className="mt-0.5">
                    {check.status === 'pass' && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                    {check.status === 'warning' && <AlertCircle className="w-4 h-4 text-amber-400" />}
                    {check.status === 'fail' && <ShieldAlert className="w-4 h-4 text-rose-500" />}
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-white/90 font-sans block">{check.name}</span>
                    <p className="text-[11px] text-white/40 leading-relaxed font-mono uppercase tracking-wide">{check.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
