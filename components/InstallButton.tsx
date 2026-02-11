import React, { useEffect, useState } from 'react';
import { Download, Share, PlusSquare, X } from 'lucide-react';

const InstallButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode (already installed)
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    setIsStandalone(isStandaloneMode);

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Capture the install prompt event for Android/Desktop
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSInstructions(true);
    } else if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

  // If already installed, don't show the button
  if (isStandalone) return null;

  // If not iOS and no install prompt is available, hide button (standard behavior)
  // But for iOS we always show it if not standalone.
  if (!isIOS && !deferredPrompt) return null;

  return (
    <>
      <button
        onClick={handleInstallClick}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-[0_0_15px_rgba(37,99,235,0.5)] animate-pulse mr-2 border border-blue-400/50"
      >
        <Download className="w-3.5 h-3.5" />
        INSTALL
      </button>

      {showIOSInstructions && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          {/* Backdrop click to close */}
          <div className="absolute inset-0" onClick={() => setShowIOSInstructions(false)}></div>
          
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl relative z-10 mb-8 sm:mb-0">
            <button 
              onClick={() => setShowIOSInstructions(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 bg-slate-800 rounded-xl flex items-center justify-center shadow-inner border border-slate-700">
                 <img src="https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg" alt="App Icon" className="w-10 h-10" />
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-white">Install ACHILLE Ai</h3>
                <p className="text-slate-400 text-sm mt-1">
                  Install on your iPhone/iPad for the best experience.
                </p>
              </div>
              
              <div className="flex flex-col gap-4 w-full text-left text-sm text-slate-200 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                <div className="flex items-center gap-3">
                  <Share className="w-6 h-6 text-blue-400" />
                  <span>1. Tap the <strong>Share</strong> button in your browser toolbar.</span>
                </div>
                <div className="w-full h-px bg-slate-700/50"></div>
                <div className="flex items-center gap-3">
                  <PlusSquare className="w-6 h-6 text-blue-400" />
                  <span>2. Scroll down and select <strong>Add to Home Screen</strong>.</span>
                </div>
              </div>
            </div>
            
            {/* Visual indicator pointing down for mobile safari users */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-900 border-b border-r border-slate-700 rotate-45 transform sm:hidden"></div>
          </div>
        </div>
      )}
    </>
  );
};

export default InstallButton;