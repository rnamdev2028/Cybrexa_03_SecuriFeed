import { GameScenario } from '../types';

export const GAME_SCENARIOS: GameScenario[] = [
  {
    id: 's1',
    type: 'email',
    senderOrDomain: 'security@accounts-google-support.com',
    subjectOrUrl: 'URGENT: Suspicious login attempt blocked on your account',
    content: `Dear User,\n\nWe detected an unauthorized login attempt from an unrecognized IP address (198.51.100.42) on your account. If this was not you, please immediately confirm your identity and secure your account by clicking the secure button below:\n\n[ SECURE MY ACCOUNT NOW ]\n\nNote: Failure to verify within 24 hours will lead to account suspension to protect our community.`,
    isPhishing: true,
    difficulty: 'easy',
    phishingIndicators: [
      'Irrelevant domain: accounts-google-support.com is not google.com',
      'Artificial urgency: 24-hour ultimatum',
      'Generic greeting: Dear User',
      'Suspicious link trigger: SECURE MY ACCOUNT NOW buttons in unrequested emails'
    ],
    explanation: 'Legitimate services like Google or Microsoft will send notifications from verified domains like @google.com or @accounts.google.com, and will never establish arbitrary 24-hour blockages to force clicks.'
  },
  {
    id: 's2',
    type: 'email',
    senderOrDomain: 'official-billing@netflix.com',
    subjectOrUrl: 'Your Netflix Membership is On Hold - Action Required',
    content: `Hi there,\n\nWe were unable to process your monthly subscription payment. As a result, your membership is currently on hold. To resolve this and keep streaming your favorite shows, please update your payment method using the link below:\n\n🔗 update-billing.netflix-portal.net/login\n\nThanks,\nNetflix Team`,
    isPhishing: true,
    difficulty: 'medium',
    phishingIndicators: [
      'Lookalike subdomain: netflix-portal.net is not official netflix.com',
      'Generic greeting: Hi there',
      'Financial threat: Threatening to shut down service immediately'
    ],
    explanation: 'Scammers create helper domains like netflix-portal.net to hijack credentials. Netflix will always direct you to log in directly via the Netflix app or the official Netflix.com website.'
  },
  {
    id: 's3',
    type: 'url',
    senderOrDomain: 'Browser Address Bar Check',
    subjectOrUrl: 'https://www.paypal.secure-login-v2.com/signin',
    content: 'A login page designed to look exactly like PayPal, requesting credit card verification details along with username and password secrets.',
    isPhishing: true,
    difficulty: 'medium',
    phishingIndicators: [
      'Pre-domain scam: secure-login-v2.com is the registered host, NOT paypal.com',
      'Overwhelming subdomains: www.paypal as a subdomain is a trick to blind search checks'
    ],
    explanation: 'The actual domain is defined by the characters right before the TLD suffix (e.g. .com). Here, the domain is secure-login-v2.com, which has nothing to do with PayPal!'
  },
  {
    id: 's4',
    type: 'sms',
    senderOrDomain: '+1 (555) 304-9841',
    subjectOrUrl: 'Postal Svc SMS notification',
    content: 'USPS Notice: Your package is arrived at the local sorting terminal but cannot be dispatched due to incorrect home address digit. Please resolve: http://192.168.99.12/u/usps-delivery',
    isPhishing: true,
    difficulty: 'easy',
    phishingIndicators: [
      'IP Address in URL: 192.168.99.12 instead of an official .gov domain',
      'Generic delivery bait: Very common automated package scam',
      'Sent from standard 10-digit consumer cell phone number instead of shortcode'
    ],
    explanation: 'Federal and international post solutions use strict secure gateways (e.g., usps.com). They never host official services on raw IP addresses or request address corrections via cell phone text alerts.'
  },
  {
    id: 's5',
    type: 'email',
    senderOrDomain: 'support@github.com',
    subjectOrUrl: '[GitHub] Security Alert: New personal access token created',
    content: `Hey coding-enthusiast,\n\nA new personal access token (classic) was created on your account with full 'repo' and 'user' access scopes on 2026-06-13 from IP 203.0.113.88. \n\nIf you created this token, you do not need to take any action.\n\nIf you do not recognize this, visit https://github.com/settings/tokens to revoke it immediately.`,
    isPhishing: false,
    difficulty: 'hard',
    phishingIndicators: [],
    explanation: 'This is a genuine GitHub automated notification. It contains a normal greeting, references official github.com URL, and does not threaten account closure. It points you to take action within your profile settings.'
  },
  {
    id: 's6',
    type: 'url',
    senderOrDomain: 'Banking Portal check',
    subjectOrUrl: 'https://security-chase.com/auth',
    content: 'A support portal asking you to synchronize your bank credentials to prevent potential identity theft.',
    isPhishing: true,
    difficulty: 'medium',
    phishingIndicators: [
      'Unregistered main domain: security-chase.com does not belong to JP Morgan Chase',
      'Suspicious registration: Banks do not register hyphenated secondary domains for simple login portals'
    ],
    explanation: 'Always browse to your standard banking portal bookmark or type the official URL directly. Scammers register lookalike domains like security-chase.com to target nervous bank clients.'
  },
  {
    id: 's7',
    type: 'email',
    senderOrDomain: 'newsletter@nasa.gov',
    subjectOrUrl: 'The James Webb Telescope spots oldest black hole yet',
    content: `Hello Earthling,\n\nAstronomers at NASA using the James Webb Space Telescope have discovered an active supermassive black hole that existed when the universe was only 570 million years old.\n\nRead the full report and see the infrared deep-field images on our official archive science catalog here: https://webb.nasa.gov/content/news/blackhole.html\n\nKeep looking up,\nNASA Science Directorate`,
    isPhishing: false,
    difficulty: 'medium',
    phishingIndicators: [],
    explanation: 'This is a legitimate educational newsletter from NASA. Sender domain ends strictly with nasa.gov, URLs are encrypted HTTPS pointing strictly to nasa.gov pages, and no credential capture is involved.'
  }
];
