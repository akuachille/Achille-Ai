import React, { useState, useEffect } from 'react';
import { BrainCircuit, Zap, Trash2, Search, Code, Key, Check, Info } from 'lucide-react';

interface SettingsPanelProps {
  useThinking: boolean;
  setUseThinking: (val: boolean) => void;
  useLite: boolean;
  setUseLite: (val: boolean) => void;
  isBananaMode: boolean;
  setIsBananaMode: (val: boolean) => void;
  useSearch: boolean;
  setUseSearch: (val: boolean) => void;
  useCode: boolean;
  setUseCode: (val: boolean) => void;
  onClearHistory: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ 
  useThinking, 
  setUseThinking, 
  useLite, 
  setUseLite,
  isBananaMode,
  setIsBananaMode,
  useSearch,
  setUseSearch,
  useCode,
  setUseCode,
  onClearHistory
}) => {
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [keyVal, setKeyVal] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem('achille_custom_api_key') || '';
    setKeyVal(savedKey);
  }, []);

  const handleKeyChange = (val: string) => {
    const trimmed = val.trim();
    setKeyVal(trimmed);
    if (trimmed) {
      localStorage.setItem('achille_custom_api_key', trimmed);
    } else {
      localStorage.removeItem('achille_custom_api_key');
    }
    setIsSaved(true);
    const timer = setTimeout(() => setIsSaved(false), 2000);
    return () => clearTimeout(timer);
  };

  return (
    <div className="p-4 bg-slate-900 border-t border-slate-800 overflow-hidden">
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
        {/* Nano Banana Mode Toggle */}
        <button
          onClick={() => {
            setIsBananaMode(!isBananaMode);
            if (!isBananaMode) {
              setUseThinking(false);
              setUseLite(false);
              setUseSearch(false);
              setUseCode(false);
            }
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold transition-all whitespace-nowrap ${
            isBananaMode
              ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.3)]'
              : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
          }`}
        >
          <span className="text-lg">🍌</span>
          Banana
        </button>

        {/* Search Toggle */}
        <button
          onClick={() => {
            setUseSearch(!useSearch);
            if (!useSearch) {
              setIsBananaMode(false);
            }
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all whitespace-nowrap ${
            useSearch
              ? 'bg-emerald-900/40 border-emerald-500 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
              : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
          }`}
        >
          <Search className="w-4 h-4" />
          Search
        </button>

        {/* Code Toggle */}
        <button
          onClick={() => {
            setUseCode(!useCode);
            if (!useCode) {
              setIsBananaMode(false);
            }
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all whitespace-nowrap ${
            useCode
              ? 'bg-orange-900/40 border-orange-500 text-orange-200 shadow-[0_0_15px_rgba(249,115,22,0.2)]'
              : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
          }`}
        >
          <Code className="w-4 h-4" />
          Code
        </button>

        {/* Thinking Mode Toggle */}
        <button
          onClick={() => {
            setUseThinking(!useThinking);
            if (!useThinking) {
              setUseLite(false);
              setIsBananaMode(false);
            } else {
              setUseLite(false);
              setIsBananaMode(false);
            }
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all whitespace-nowrap ${
            useThinking
              ? 'bg-purple-900/40 border-purple-500 text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
              : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
          }`}
        >
          <BrainCircuit className="w-4 h-4" />
          Thinking
        </button>

        {/* Fast Mode Toggle */}
        <button
          onClick={() => {
            setUseLite(!useLite);
            if (!useLite) {
              setUseThinking(false);
              setIsBananaMode(false);
            } else {
              setUseThinking(false);
              setIsBananaMode(false);
            }
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all whitespace-nowrap ${
            useLite
              ? 'bg-blue-900/40 border-blue-500 text-blue-200 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
              : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
          }`}
        >
          <Zap className="w-4 h-4" />
          Lite
        </button>

        {/* Custom API Key Configuration Toggle */}
        <button
          onClick={() => setShowKeyInput(!showKeyInput)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all whitespace-nowrap ${
            showKeyInput || keyVal
              ? 'bg-indigo-900/40 border-indigo-500 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)]'
              : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
          }`}
        >
          <Key className="w-4 h-4" />
          {keyVal ? 'API Key Set' : 'API Key (Netlify)'}
        </button>

        {/* Clear History Button */}
        <button
          onClick={onClearHistory}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-700 bg-slate-800 text-slate-400 hover:bg-red-900/20 hover:border-red-500/50 hover:text-red-400 transition-all whitespace-nowrap"
        >
          <Trash2 className="w-4 h-4" />
          Clear Chat
        </button>
      </div>

      {showKeyInput && (
        <div id="api-key-config" className="mt-3 p-3 bg-slate-950/70 rounded-xl border border-slate-800 text-xs">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label htmlFor="custom-key-input" className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-indigo-400" />
                Custom Gemini API Key
              </label>
              <span className="text-[10px] text-slate-500">Stored locally in your browser</span>
            </div>
            
            <div className="flex gap-2 items-center">
              <input
                id="custom-key-input"
                type="password"
                placeholder={keyVal ? "••••••••••••••••••••••••••••" : "Paste your Gemini API Key (AIzaSy...)"}
                value={keyVal}
                onChange={(e) => handleKeyChange(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-xs text-security"
              />
              {isSaved && (
                <span className="flex items-center gap-1 text-emerald-400 text-[10px] font-bold px-2 py-1.5 bg-emerald-950/40 border border-emerald-500/30 rounded-lg">
                  <Check className="w-3 h-3" /> Saved
                </span>
              )}
            </div>
            
            <div className="text-slate-400 leading-relaxed mt-1 flex items-start gap-1.5">
              <Info className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 mt-0.5" />
              <span>
                By default, the server uses your Netlify <strong>GEMINI_API_KEY</strong> environment variable compiled during the build. If it's empty, you can paste an API key above. Under your Netlify site dashboard (<strong>Site configuration &gt; Environment variables</strong>), add <code>GEMINI_API_KEY</code> and trigger a new deploy to make it permanent for everyone automatically!
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPanel;