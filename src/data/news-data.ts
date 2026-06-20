import { NewsItem } from '../types';

export const INITIAL_NEWS: NewsItem[] = [
  {
    id: 'n1',
    title: 'Massive "Postal-Delivery" SMS Smishing Campaign Targeting North America',
    summary: 'A coordinated smishing campaign mimicking federal postal services is utilizing lookalike domains like "usps-package-lookup.online" and temporary server IP-URLs to harvest credit card digits.',
    source: 'SecurFeed Threat Intelligence Group',
    category: 'phishing',
    severity: 'High',
    publishedAt: '2026-06-12T14:30:00Z',
    link: '#'
  },
  {
    id: 'n2',
    title: 'Zero-Click RCE Vulnerability in Popular Email Client Patched',
    summary: 'A critical zero-day allowing malicious actors to execute arbitrary code via specialized rich MIME-types has been resolved. Updates should be applied immediately to prevent corporate directory compromise.',
    source: 'CISA Security Bulletin',
    category: 'vulnerability',
    severity: 'Critical',
    publishedAt: '2026-06-11T09:15:00Z',
    link: '#'
  },
  {
    id: 'n3',
    title: 'Rise of AI-Driven Lookalike Character Typosquatting',
    summary: 'Phishing actors are increasingly utilizing Generative AI Models to craft exact copycats of corporate support desks. Lookalike Cyrillic characters (homoglyphs) are registered to escape classic keyword filters.',
    source: 'Global Threat Intel Network',
    category: 'phishing',
    severity: 'Medium',
    publishedAt: '2026-06-09T18:45:00Z',
    link: '#'
  },
  {
    id: 'n4',
    title: 'Ransomware Group Deploys Mimicry Portals targeting Financial Staff',
    summary: 'Financially motivated ransomware gangs are using fake login pages pointing to bank authentication services. The attack begins with highly targeted emails containing malicious redirect chains.',
    source: 'Cyber Threat Alliance',
    category: 'malware',
    severity: 'High',
    publishedAt: '2026-06-08T11:00:00Z',
    link: '#'
  },
  {
    id: 'n5',
    title: 'Secure Socket Layer (SSL) Check: Why Bad Actors LOVE HTTPS',
    summary: 'Recent metrics show over 89% of active phishing websites now employ completely valid Let\'s Encrypt SSL certificates. Modern internet browsers highlighting "HTTPS is Secure" can inadvertently blind users to malicious domains.',
    source: 'PhishDetect Advisory board',
    category: 'general',
    severity: 'Low',
    publishedAt: '2026-06-05T13:20:00Z',
    link: '#'
  }
];
