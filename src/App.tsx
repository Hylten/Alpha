import { useState } from 'react';
import { Lock, Server, Cpu, Activity, ShieldCheck, Zap, X, Linkedin, AlertCircle } from 'lucide-react';
import { AlphaIntelligenceIndex } from './components/intelligence/AlphaIntelligenceIndex';
import { AlphaIntelligenceArticle } from './components/intelligence/AlphaIntelligenceArticle';

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [accessKey, setAccessKey] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // No valid credentials exist — always show error
    if (!identifier.trim() || !accessKey.trim()) {
      setLoginError('All fields are required.');
    } else {
      setLoginError('Invalid credentials. Access denied.');
    }
  };

  const openLogin = () => {
    setShowLogin(true);
    setLoginError('');
    setIdentifier('');
    setAccessKey('');
  };

  // SEO Route Hijack
  const path = window.location.pathname;
  if (path.startsWith('/intelligence')) {
    const slug = path.replace('/intelligence', '').replace(/^\/|\/$/g, '');

    return (
      <div className="min-h-screen bg-obsidian text-platinum font-sans selection:bg-oldgold selection:text-obsidian bg-grid overflow-hidden">
        {/* HEADER */}
        <header className="absolute top-0 left-0 w-full z-50 px-8 py-6 flex justify-between items-center border-b border-white/5 bg-obsidian/80 backdrop-blur-md">
          <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
            <span className="font-mono text-[10px] tracking-[0.2em] font-medium text-gray-500 uppercase">System Online</span>
          </a>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/5 rounded-sm">
              <span className="w-1.5 h-1.5 bg-oldgold rounded-full"></span>
              <span className="text-[10px] tracking-widest text-gray-400 uppercase">v4.0.2-ALPHA</span>
            </div>
            <a
              href="/"
              className="flex items-center gap-1.5 text-gray-700 hover:text-gray-500 transition-colors group"
              title="Return to Core"
            >
              <X className="w-4 h-4 group-hover:text-oldgold transition-colors" />
            </a>
          </div>
        </header>

        <main className="flex-grow">
          {slug ? (
            <AlphaIntelligenceArticle slug={slug} />
          ) : (
            <AlphaIntelligenceIndex />
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian text-platinum font-sans selection:bg-oldgold selection:text-obsidian bg-grid overflow-hidden">

      {/* HEADER */}
      <header className="absolute top-0 left-0 w-full z-50 px-8 py-6 flex justify-between items-center border-b border-white/5 bg-obsidian/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
          <span className="font-mono text-[10px] tracking-[0.2em] font-medium text-gray-500 uppercase">System Online</span>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/5 rounded-sm">
            <span className="w-1.5 h-1.5 bg-oldgold rounded-full"></span>
            <span className="text-[10px] tracking-widest text-gray-400 uppercase">v4.0.2-ALPHA</span>
          </div>

          <button
            onClick={openLogin}
            className="flex items-center gap-1.5 text-gray-700 hover:text-gray-500 transition-colors group"
            title="Restricted Access"
          >
            <Lock className="w-3 h-3 group-hover:text-oldgold transition-colors" />
          </button>
        </div>
      </header>

      {/* LOGIN MODAL */}
      {showLogin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowLogin(false)}
          ></div>

          <div className="relative w-full max-w-sm mx-4 border border-white/10 bg-obsidian/95 backdrop-blur-md shadow-2xl">
            <button
              onClick={() => setShowLogin(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-platinum transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-10">
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-2 h-2 bg-oldgold rotate-45"></div>
                  <span className="text-[10px] tracking-[0.3em] text-gray-500 uppercase">Secure Access</span>
                </div>
                <h2 className="font-serif text-2xl text-platinum tracking-tight">Authentication</h2>
                <p className="text-[11px] text-gray-500 mt-2 tracking-wide">Authorized personnel only.</p>
              </div>

              {/* Error message */}
              {loginError && (
                <div className="flex items-center gap-2 mb-5 px-3 py-2.5 border border-red-900/50 bg-red-950/30">
                  <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                  <span className="text-[10px] text-red-400 tracking-wide">{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-[9px] tracking-[0.2em] text-gray-500 uppercase mb-2">Identifier</label>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => { setIdentifier(e.target.value); setLoginError(''); }}
                    placeholder="agent@roials.co"
                    className="w-full bg-transparent border border-white/10 px-4 py-3 text-sm text-platinum placeholder:text-gray-700 focus:outline-none focus:border-oldgold/50 transition-colors tracking-wide"
                  />
                </div>
                <div>
                  <label className="block text-[9px] tracking-[0.2em] text-gray-500 uppercase mb-2">Access Key</label>
                  <input
                    type="password"
                    value={accessKey}
                    onChange={(e) => { setAccessKey(e.target.value); setLoginError(''); }}
                    placeholder="••••••••••••"
                    className="w-full bg-transparent border border-white/10 px-4 py-3 text-sm text-platinum placeholder:text-gray-700 focus:outline-none focus:border-oldgold/50 transition-colors tracking-wide"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full border border-oldgold/40 bg-oldgold/5 py-3 text-[10px] tracking-[0.2em] text-oldgold uppercase hover:bg-oldgold/10 transition-colors mt-2"
                >
                  Authenticate
                </button>
              </form>

              <p className="text-[9px] text-gray-700 mt-6 text-center tracking-wider">
                Access restricted to authorized operators.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <main className="relative h-screen flex flex-col justify-center items-center px-4">

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-oldgold/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">

          <div className="mb-8 flex justify-center">
            <div className="px-4 py-1 border border-white/10 bg-black/50 backdrop-blur-sm">
              <span className="text-[10px] tracking-[0.3em] text-oldgold uppercase">Internal Infrastructure</span>
            </div>
          </div>

          <h1 className="font-serif text-5xl md:text-7xl text-platinum leading-none tracking-tight mb-8">
            ROIALS <span className="font-light italic text-gray-600">ALPHA</span>
          </h1>

          <p className="text-sm md:text-base text-gray-400 max-w-lg mx-auto leading-relaxed tracking-wide mb-16 border-l border-oldgold/30 pl-6 text-left">
            Operational backbone for private equity deployment.
            <br />
            Architecting <strong className="text-platinum font-medium">deal flow</strong>, <strong className="text-platinum font-medium">agentic workflows</strong>, and <strong className="text-platinum font-medium">capital efficiency</strong>.
          </p>

          {/* SYSTEM MODULES GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 dark:bg-white/5 border border-white/10">

            {/* MODULE 01 */}
            <div className="bg-obsidian p-8 hover:bg-white/5 transition-colors group text-left">
              <div className="flex justify-between items-start mb-4">
                <Server className="w-5 h-5 text-gray-600 group-hover:text-oldgold transition-colors" />
                <span className="text-[9px] tracking-widest text-gray-700 group-hover:text-oldgold/70">MOD 01</span>
              </div>
              <h3 className="text-sm tracking-widest text-platinum uppercase mb-2">Deal Flow</h3>
              <p className="text-[10px] text-gray-500 leading-relaxed">Automated origination & screening architecture.</p>
            </div>

            {/* MODULE 02 */}
            <div className="bg-obsidian p-8 hover:bg-white/5 transition-colors group text-left">
              <div className="flex justify-between items-start mb-4">
                <Cpu className="w-5 h-5 text-gray-600 group-hover:text-oldgold transition-colors" />
                <span className="text-[9px] tracking-widest text-gray-700 group-hover:text-oldgold/70">MOD 02</span>
              </div>
              <h3 className="text-sm tracking-widest text-platinum uppercase mb-2">Agentic Workflows</h3>
              <p className="text-[10px] text-gray-500 leading-relaxed">Autonomous AI agents orchestrating operational processes.</p>
            </div>

            {/* MODULE 03 */}
            <div className="bg-obsidian p-8 hover:bg-white/5 transition-colors group text-left">
              <div className="flex justify-between items-start mb-4">
                <Activity className="w-5 h-5 text-gray-600 group-hover:text-oldgold transition-colors" />
                <span className="text-[9px] tracking-widest text-gray-700 group-hover:text-oldgold/70">MOD 03</span>
              </div>
              <h3 className="text-sm tracking-widest text-platinum uppercase mb-2">Capital Deployment</h3>
              <p className="text-[10px] text-gray-500 leading-relaxed">High-velocity resource allocation systems.</p>
            </div>

          </div>

        </div>

      </main>

      {/* FOOTER */}
      <footer className="absolute bottom-0 left-0 w-full z-50 px-8 py-6 border-t border-white/5 flex justify-between items-center text-[10px] text-gray-600 tracking-widest uppercase bg-obsidian/90 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2 text-gray-700 text-[9px] normal-case tracking-wider">
            <ShieldCheck className="w-2.5 h-2.5 text-gray-700" />
            Secure environment
          </span>
          <span className="hidden md:inline text-gray-800">|</span>
          <span className="hidden md:flex items-center gap-2 text-gray-700 text-[9px] normal-case tracking-wider">
            <Zap className="w-2.5 h-2.5 text-gray-700" />
            Low latency
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* WhatsApp - super discreet */}
          <a
            href="https://wa.me/46701619978?text=Regarding%20Operational%20Alpha.%20"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 hover:text-gray-500 transition-colors"
            title="WhatsApp"
          >
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </a>

          {/* LinkedIn - super discreet */}
          <a
            href="https://www.linkedin.com/company/roials-alpha/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 hover:text-gray-500 transition-colors"
            title="LinkedIn"
          >
            <Linkedin className="w-3 h-3" />
          </a>

          <span className="text-gray-800">|</span>

          {/* Roials Capital link */}
          <a
            href="https://roialscapital.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 hover:text-gray-500 transition-colors normal-case tracking-wider text-[9px]"
          >
            roialscapital.com
          </a>

          <span className="text-gray-800">|</span>

          <span className="text-gray-700">
            &copy; {new Date().getFullYear()}
          </span>
        </div>
      </footer>

    </div>
  );
}

export default App;
