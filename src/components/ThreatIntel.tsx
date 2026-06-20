import { useState, FormEvent } from 'react';
import { Search, Radio, PlusCircle, AlertOctagon, Check, Send, AlertTriangle, MessageSquare, ShieldCheck, Tag } from 'lucide-react';
import { NewsItem, ThreatReport } from '../types';

interface ThreatIntelProps {
  newsList: NewsItem[];
  threatReports: ThreatReport[];
  onAddNews: (item: NewsItem) => void;
  onAddReport: (report: ThreatReport) => void;
}

export default function ThreatIntel({ newsList, threatReports, onAddNews, onAddReport }: ThreatIntelProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  const [showReportForm, setShowReportForm] = useState(false);
  const [reporterName, setReporterName] = useState('');
  const [reportedUrl, setReportedUrl] = useState('');
  const [sightingType, setSightingType] = useState('Phishing Domain');
  const [description, setDescription] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleReportSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const name = reporterName.trim().replace(/<[^>]*>/g, '');
    const url = reportedUrl.trim().replace(/<[^>]*>/g, '');
    const desc = description.trim().replace(/<[^>]*>/g, '');

    if (!name || !url || !desc) {
      setFormError('All fields are required to log an authorized sighting reported indicator.');
      return;
    }

    if (url.length > 300) {
      setFormError('URL exceeds safe length limit (300 characters).');
      return;
    }

    const reportId = 'report_' + Date.now();
    const newReport: ThreatReport = {
      id: reportId,
      reporterName: name,
      reportedUrl: url,
      sightingType,
      description: desc,
      submittedAt: new Date().toISOString(),
    };

    onAddReport(newReport);

    const newNewsItem: NewsItem = {
      id: 'news_' + Date.now(),
      title: `Suspicious ${sightingType}: "${url}"`,
      summary: `Intel uploaded securely by operator "${name}". Description: ${desc}`,
      source: 'Operator Crowd-Sourced Feed',
      category: sightingType.toLowerCase().includes('phish') ? 'phishing' : 'malware',
      severity: 'High',
      publishedAt: new Date().toISOString(),
      link: '#'
    };

    onAddNews(newNewsItem);

    setReporterName('');
    setReportedUrl('');
    setSightingType('Phishing Domain');
    setDescription('');
    setIsSubmitted(true);
    
    setTimeout(() => {
      setIsSubmitted(false);
      setShowReportForm(false);
    }, 2500);
  };

  const filteredAdvisories = newsList.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.source.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesSeverity = severityFilter === 'all' || item.severity === severityFilter;

    return matchesSearch && matchesCategory && matchesSeverity;
  });

  return (
    <div className="space-y-12 animate-fade-in max-w-5xl mx-auto">
      
      {/* Title block */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-baseline border-b border-white/10 pb-8 gap-4">
        <div>
          <label className="text-[10px] uppercase tracking-[0.25em] text-white/40 font-mono block mb-2">
            Database // Cooperative Feeds
          </label>
          <h2 className="text-3xl md:text-4xl font-serif italic text-white flex items-center gap-3 font-medium">
            <Radio className="w-5 h-5 text-rose-500 animate-pulse" />
            Threat Intelligence & Advisory Board.
          </h2>
          <p className="text-[#A0A0A5] text-sm mt-2 max-w-2xl leading-relaxed">
            Live broadcasts of structural malware patterns, zero-days, homoglyphs, and SSL anomalies, tracked crowdsourced reports, and verified agency insights.
          </p>
        </div>
        
        <button
          onClick={() => setShowReportForm(!showReportForm)}
          className="px-5 py-3 border border-white/20 hover:bg-white hover:text-black font-semibold text-xs tracking-widest uppercase transition-colors duration-150 rounded-none cursor-pointer"
        >
          {showReportForm ? 'CLOSE LOG // x' : 'LOG SIGHTING // +'}
        </button>
      </div>

      {/* Sighting Reporting Form */}
      {showReportForm && (
        <div className="bg-[#0F0F11] border border-white/10 p-8 space-y-6 animate-fade-in">
          <div className="border-b border-white/5 pb-4 flex items-center gap-3 lg:-mx-2">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white font-sans">Indicators of Compromise Reporting System</h3>
              <p className="text-xs text-white/40 mt-1">Provide verifiable details of suspicious phishing lookalikes or cleartext traps.</p>
            </div>
          </div>

          {isSubmitted ? (
            <div className="py-12 text-center space-y-3">
              <div className="inline-flex p-3 bg-emerald-500/10 text-emerald-400 mb-2 rounded-none border border-emerald-500/20">
                <Check className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold tracking-wider text-white uppercase font-mono">Transmission Transmitted Successfully</p>
              <p className="text-xs text-white/40">Telemetry registry processed and updated.</p>
            </div>
          ) : (
            <form onSubmit={handleReportSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div>
                <label className="block text-[10px] text-white/40 font-mono mb-2 uppercase tracking-widest">Reporter Operator ID</label>
                <input
                  type="text"
                  placeholder="e.g. Security_Hunter_01"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white text-xs font-mono outline-none p-3 focus:bg-white/10"
                />
              </div>

              <div>
                <label className="block text-[10px] text-white/40 font-mono mb-2 uppercase tracking-widest">Sighting Vector class</label>
                <select
                  value={sightingType}
                  onChange={(e) => setSightingType(e.target.value)}
                  className="w-full bg-white/5 border border-[#1b1b1f] text-slate-300 text-xs font-mono outline-none p-3 focus:bg-white/10 cursor-pointer"
                >
                  <option value="Phishing Domain">Phishing Domain</option>
                  <option value="Homoglyph Spoof">Homoglyph Spoof</option>
                  <option value="Insecure Port Alert">Insecure Port Alert</option>
                  <option value="IP Address URL">IP Address URL</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] text-white/40 font-mono mb-2 uppercase tracking-widest">Suspect Link or domain</label>
                <input
                  type="text"
                  placeholder="e.g. accounts-verizon-secure.online"
                  value={reportedUrl}
                  onChange={(e) => setReportedUrl(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white text-xs font-mono outline-none p-3 focus:bg-white/10"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] text-white/40 font-mono mb-2 uppercase tracking-widest">Detailed Sighting Analysis</label>
                <textarea
                  rows={2}
                  placeholder="Explain structural lookalikes, visual spoofs, or suspicious redirection protocols..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white text-xs font-sans outline-none p-3 focus:bg-white/10"
                />
              </div>

              {formError && (
                <div className="md:col-span-2 text-xs font-mono uppercase tracking-wider text-rose-400">
                  ERROR // {formError}
                </div>
              )}

              <div className="md:col-span-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-white text-black text-xs font-semibold uppercase tracking-widest hover:bg-[#E0E0E0] transition-colors rounded-none cursor-pointer"
                >
                  TRANSMIT SIGHTING // ENQUEUE
                </button>
              </div>

            </form>
          )}
        </div>
      )}

      {/* Sighting log cards list */}
      {threatReports.length > 0 && (
        <div className="space-y-4">
          <label className="block text-[10px] uppercase tracking-[0.2em] text-[#A0A0A5] font-mono">
            Recent Sighting Indicators enqueued by users
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {threatReports.map((report) => (
              <div key={report.id} className="bg-[#0F0F11] border border-white/10 p-5 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-baseline mb-2 text-[#A0A0A5] font-mono text-[9px] uppercase tracking-wider">
                    <span>{report.sightingType}</span>
                    <span>{new Date(report.submittedAt).toLocaleTimeString()}</span>
                  </div>
                  <strong className="text-white font-mono break-all font-semibold block text-xs">
                    {report.reportedUrl}
                  </strong>
                  <p className="text-[#A0A0A5] text-xs mt-2 line-clamp-3 leading-relaxed font-sans">
                    {report.description}
                  </p>
                </div>
                <div className="flex justify-between items-center text-[9px] font-mono text-white/40 uppercase tracking-widest pt-2 border-t border-white/5">
                  <span>Author: {report.reporterName}</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Checked
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters Form Section */}
      <div className="border border-white/10 p-6 bg-[#0F0F11]">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4" />
            <input
              type="text"
              placeholder="Search threat advisories, keyword signatures, sources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0A0A0B]/60 border border-white/10 pl-11 pr-4 py-3 text-xs text-white placeholder-white/40 font-mono outline-none focus:border-white transition"
            />
          </div>

          <div className="flex flex-wrap gap-4 w-full md:w-auto font-mono uppercase tracking-widest text-[10px]">
            <div className="flex items-center gap-2">
              <span className="text-white/40">Category:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-transparent border-b border-white/20 text-white text-xs uppercase outline-none pb-0.5 cursor-pointer max-w-[130px]"
              >
                <option value="all">ALL CLASSES</option>
                <option value="phishing">PHISHING VECTORS</option>
                <option value="malware">MALWARE</option>
                <option value="vulnerability">CVE BULLETINS</option>
                <option value="general">GENERAL GUIDES</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-white/40">Severity:</span>
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="bg-transparent border-b border-white/20 text-white text-xs uppercase outline-none pb-0.5 cursor-pointer max-w-[130px]"
              >
                <option value="all">ALL SEVERITY</option>
                <option value="Critical">CRITICAL</option>
                <option value="High">HIGH</option>
                <option value="Medium">MEDIUM</option>
                <option value="Low">LOW</option>
              </select>
            </div>
          </div>

        </div>
      </div>

      {/* Advisories Feed List Card - Editorial Post list */}
      <div className="space-y-4">
        {filteredAdvisories.length === 0 ? (
          <div className="bg-[#0F0F11] border border-white/10 p-12 text-center text-white/40 uppercase tracking-widest font-mono text-xs">
            <AlertOctagon className="w-8 h-8 text-rose-500/40 mx-auto mb-3" />
            <p>No matching advisories enqueued in this sector.</p>
          </div>
        ) : (
          filteredAdvisories.map((news) => (
            <div
              key={news.id}
              className="bg-[#0F0F11] border border-white/5 hover:border-white/15 p-8 transition-colors duration-150 space-y-4"
            >
              <div className="flex flex-col sm:flex-row justify-between sm:items-baseline gap-2 pb-3 border-b border-white/5">
                <div className="flex gap-3 items-center">
                  <span className={`text-[8px] font-mono tracking-widest uppercase font-semibold px-2 py-0.5 border ${
                    news.severity === 'Critical' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' :
                    news.severity === 'High' ? 'bg-rose-500/10 border-rose-500/10 text-rose-400' :
                    news.severity === 'Medium' ? 'bg-amber-500/10 border-amber-500/10 text-amber-300' :
                    'bg-white/5 border-white/10 text-white/50'
                  }`}>
                    {news.severity} // SEVERITY
                  </span>
                  
                  <span className="inline-flex items-center gap-1 text-[8px] text-white/50 font-mono uppercase tracking-widest">
                    <Tag className="w-2.5 h-2.5 text-white/30" />
                    {news.category}
                  </span>
                </div>

                <span className="text-[10px] text-white/40 font-mono uppercase">
                  {new Date(news.publishedAt).toLocaleDateString()} // {new Date(news.publishedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-serif text-white italic leading-tight hover:text-rose-200 transition duration-150">
                  {news.title}
                </h3>
                <p className="text-sm text-white/60 mt-3 leading-relaxed font-sans max-w-3xl">
                  {news.summary}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between text-[10px] text-white/40 font-mono uppercase tracking-wider">
                <span className="flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5" />
                  Source Class: <strong className="text-white/80 select-all normal-case">{news.source}</strong>
                </span>
                
                <span className="text-rose-400 border-b border-rose-500/30 hover:text-white transition duration-150 cursor-pointer font-bold inline-flex items-center gap-1">
                  VIEW TELEMETRY →
                </span>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
