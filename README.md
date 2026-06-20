# SecuriFeed — PhishDetect

A high-performance cybersecurity hub and intelligence dashboard featuring real-time safe sandboxed link analysis, public threat feeds, and interactive defense reflex training modules.

---

## 🚀 Core Features

- **Automated URL Diagnostics (Link Scanner)**  
  Deconstructs target URLs to flag potential security compromises:
  - **TLS/SSL Encryption Check**: Triggers warnings for plaintext HTTP traps.
  - **Trademark Typosquatting**: Detects lookalike spellings of high-frequency trusted domains.
  - **Unicode Homoglyph Detection**: Identifies character substitution spoofs (Punycode characters).
  - **Subdomain Chains & Suffix Check**: Flags extreme nesting depths and disposable top-level domains.

- **Threat Advisory cooperative Feed**  
  An interactive, searchable IoC (Indicators of Compromise) dashboard allowing operators to log sightings, filter messages by category, and record verified incidents.

- **Human Firewall: Reflex Training Simulator**  
  An educational workspace simulator loaded with multiple scenarios across email, text messages (SMS), and URL structures to strengthen defensive recognition, complete with stats counters and multipliers.

---

## 🛠️ Technology Stack

- **Client App**: React 19, Vite, Tailwind CSS v4, Lucide Icons, and standard CSS transitions.
- **Server**: Express.js (secure input parsing and fallback local heuristics engine).
- **Bundle**: Server files are compiled to a clean production-optimized `dist/server.cjs` script.

---

## ⚙️ How to Setup and Run Locally

### 1. Install Dependencies
Run the package installation in the root directory:
```bash
npm install
```

### 2. Launch Development Server
Starts the full-stack server with hot-reloading asset middleware:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) inside your web browser.

### 3. Build for Production
Compiles final production bundles:
```bash
npm run build
```

### 4. Execute Production Standalone App
Launches the built high-speed server:
```bash
npm run start
```
