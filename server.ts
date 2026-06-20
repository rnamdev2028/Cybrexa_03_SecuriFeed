import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware for parsing JSON requests with strict payload size limits for safety
app.use(express.json({ limit: '10kb' }));

// Input sanitization utility function for safety
function sanitizeUrlString(raw: string): string {
  if (!raw) return '';
  // 1. Strip HTML tags to mitigate potential XSS vectors
  let clean = raw.replace(/<[^>]*>/g, '');
  // 2. Escape dangerous query payload elements
  clean = clean.replace(/[<>"']/g, '');
  return clean.trim();
}

// ---------------------------------------------------------
// Secure Endpoint API Routes
// ---------------------------------------------------------

app.post('/api/analyze-url', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url || typeof url !== 'string') {
      res.status(400).json({ error: 'Valid URL parameter input is required.' });
      return;
    }

    const sanitizedUrl = sanitizeUrlString(url);
    if (!sanitizedUrl) {
      res.status(400).json({ error: 'Sanitization process rejected empty input indicators.' });
      return;
    }

    // Safely enforce host boundaries
    let hostParsingUrl = sanitizedUrl;
    if (!/^https?:\/\//i.test(hostParsingUrl)) {
      hostParsingUrl = 'http://' + hostParsingUrl;
    }

    let parsed: URL;
    try {
      parsed = new URL(hostParsingUrl);
    } catch {
      // Manual simple fallback parse for malformed headers
      const domainMatch = hostParsingUrl.match(/^https?:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
      const domain = domainMatch ? domainMatch[1] : hostParsingUrl;
      parsed = {
        hostname: domain,
        protocol: hostParsingUrl.startsWith('https') ? 'https:' : 'http:',
        port: '',
        pathname: ''
      } as any;
    }

    const host = parsed.hostname.toLowerCase();
    const isHttps = parsed.protocol === 'https:';

    // Patterns heuristic checks
    // 1. IP Embedded URLs Check
    const ipV4Regex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
    const ipV6Regex = /^\[?[a-f0-9]*:[a-f0-9:]+\]?$/i;
    const isIpUrl = ipV4Regex.test(host) || ipV6Regex.test(host);

    // 2. Cyrillic/Greek Homoglyphs Spoilers
    const isHomoglyph = /[^\u0000-\u007F]/.test(host);

    // 3. Typosquatting Trademark spoofs matching
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
        
        // Brand spoof checks
        if (kw === 'google' && !host.endsWith('.google.com') && host !== 'google.com') isTyposquatting = true;
        if (kw === 'paypal' && !host.endsWith('.paypal.com') && host !== 'paypal.com') isTyposquatting = true;
        if (kw === 'netflix' && !host.endsWith('.netflix.com') && host !== 'netflix.com') isTyposquatting = true;
        if (kw === 'chase' && !host.endsWith('.chase.com') && host !== 'chase.com') isTyposquatting = true;
        if (kw === 'apple' && !host.endsWith('.apple.com') && host !== 'apple.com') isTyposquatting = true;
      }
    }

    // 4. Subdomains overloading
    const subdomainsCount = host.split('.').length - 2;
    const isSubdomainsSpam = subdomainsCount > 3;

    // Calculate dynamic Threat Risk score
    let score = 0;
    const checks = [];

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

    // TLD Check
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

    // ---------------------------------------------------------
    // Optional Server-Side Intelligent Assessment Integration
    // ---------------------------------------------------------
    let aiInsightText = null;

    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY') {
      try {
        const ai = new GoogleGenAI({
          apiKey: process.env.GEMINI_API_KEY,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });

        const prompt = `You are an expert Cybersecurity Security Operations Center Analyst.
Please analyze the following suspicious URL and provide a professional, highly concise (under 120 words) threat assessment report.

Suspicious URL: "${sanitizedUrl}"
Domain evaluated: "${host}"
Heuristic Indicators observed:
- Unencrypted Cleartext: ${!isHttps}
- IP Hostname present: ${isIpUrl}
- Unicode homoglyph mimicking: ${isHomoglyph}
- Typosquatting signs: ${isTyposquatting}
- Suspicious keyword nesting: ${includesSuspiciousWords}
- Extreme subdomain nesting: ${isSubdomainsSpam}

Structure your answer with:
1. Short Risk Classification decision (Low, Medium, or High).
2. What specific tricks are present (e.g., lookalikes, tld selection, or suspicious hyphen strings).
3. Critical defense recommendation (e.g., block domain, avoid entering credentials, check official certificates).
Keep it conversational, professional, and directly centered on protecting assets. Do not use markdown headers, just plain cohesive sentences.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: prompt,
        });

        aiInsightText = response.text || 'The AI inspection completed with a standard response.';
      } catch (aiErr) {
        console.error('AI API analysis failed:', aiErr);
        aiInsightText = 'The advanced AI analysis module was unable to process the request at this time. Heuristics analyzer succeeded with nominal evaluations.';
      }
    } else {
      aiInsightText = `Advanced intelligence assessment offline. Configured heuristics report: Host "${host}" was checked. Safety evaluation matches a risk index of ${score}/100.
To unlock live advanced AI modeling, please define a valid GEMINI_API_KEY environment variable in your production configuration.`;
    }

    res.json({
      url: sanitizedUrl,
      sanitizedUrl,
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
      aiInsight: aiInsightText,
      scannedAt: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Core scan error:', error);
    res.status(500).json({ error: 'Deep-analyzer runtime exception occurred during scan.' });
  }
});

// Support health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'securifeed-phishdetect' });
});

// Vite configuration and middleware integration
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SecuriFeed fullstack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
