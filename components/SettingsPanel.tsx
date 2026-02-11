import React from 'react';
import { BrainCircuit, Zap, Trash2, Palette } from 'lucide-react';

interface SettingsPanelProps {
  useThinking: boolean;
  setUseThinking: (val: boolean) => void;
  useLite: boolean;
  setUseLite: (val: boolean) => void;
  isBananaMode: boolean;
  setIsBananaMode: (val: boolean) => void;
  onClearHistory: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ 
  useThinking, 
  setUseThinking, 
  useLite, 
  setUseLite,
  isBananaMode,
  setIsBananaMode,
  onClearHistory
}) => {
  return (
    <div className="p-4 bg-slate-900 border-t border-slate-800 overflow-hidden">
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-1">
        {/* Nano Banana Mode Toggle */}
        <button
          onClick={() => {
            setIsBananaMode(!isBananaMode);
            if (!isBananaMode) {
              setUseThinking(false);
              setUseLite(false);
            }
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold transition-all whitespace-nowrap ${
            isBananaMode
              ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.3)]'
              : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
          }`}
        >
          <span className="text-lg">🍌</span>
          Banana Image Gen
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
          Pro Thinking
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
          Flash Lite
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
    </div>
  );
};

export default SettingsPanel;