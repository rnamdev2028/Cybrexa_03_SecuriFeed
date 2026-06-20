export interface SSLInfo {
  hasSsl: boolean;
  protocol: string;
  warning: string | null;
  port: number;
}

export interface PatternsDetected {
  Typosquatting: boolean;
  IpUrl: boolean;
  Homoglyphs: boolean;
  SuspiciousWords: boolean;
  Subdomains: boolean;
}

export interface CheckItem {
  name: string;
  status: 'pass' | 'warning' | 'fail';
  message: string;
}

export interface AnalysisResult {
  url: string;
  sanitizedUrl: string;
  riskScore: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  sslInfo: SSLInfo;
  patternsDetected: PatternsDetected;
  detailedChecks: CheckItem[];
  aiInsight: string | null;
  scannedAt: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  category: 'phishing' | 'malware' | 'vulnerability' | 'general';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  publishedAt: string;
  link: string;
}

export interface ThreatReport {
  id: string;
  reporterName: string;
  reportedUrl: string;
  sightingType: string;
  description: string;
  submittedAt: string;
}

export interface GameScenario {
  id: string;
  type: 'email' | 'url' | 'sms';
  senderOrDomain: string;
  subjectOrUrl: string;
  content: string;
  isPhishing: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  phishingIndicators: string[];
  explanation: string;
}

export interface UserStats {
  score: number;
  streak: number;
  levelsCompleted: number;
  totalAnswered: number;
  correctAnswers: number;
}
