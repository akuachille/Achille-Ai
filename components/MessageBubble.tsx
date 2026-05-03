import React, { useState } from 'react';
import { Message, Sender } from '../types';
import { generateSpeech, playAudioBuffer } from '../services/geminiService';
import { Loader2, Play, Volume2, ExternalLink } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === Sender.User;
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);

  const handlePlayTTS = async () => {
    if (isPlaying || isGeneratingAudio) return;
    
    setIsGeneratingAudio(true);
    try {
      const buffer = await generateSpeech(message.text);
      if (buffer) {
        setIsPlaying(true);
        playAudioBuffer(buffer);
        // Reset playing state after duration (approximate)
        setTimeout(() => setIsPlaying(false), buffer.duration * 1000);
      }
    } catch (e) {
      console.error("Failed to play audio", e);
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  return (
    <div className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700'
        }`}
      >
        {/* Render Image if available */}
        {message.image && (
          <div className="mb-3 rounded-lg overflow-hidden border border-white/10">
            <img src={message.image} alt="User upload" className="w-full h-auto object-cover max-h-60" />
          </div>
        )}

        {/* Message Text */}
        <div className="whitespace-pre-wrap text-sm leading-relaxed">
           {message.text}
        </div>

        {/* Search Sources */}
        {message.sources && message.sources.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-700/50">
            <p className="text-[10px] uppercase font-bold text-slate-500 mb-2 tracking-wider italic">Sources found on Google Search:</p>
            <div className="flex flex-wrap gap-2">
              {message.sources.map((source, i) => (
                <a
                  key={i}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-2 py-1 bg-slate-900/50 hover:bg-slate-900 border border-slate-700 rounded text-[10px] text-blue-400 max-w-full transition-colors"
                >
                  <span className="truncate max-w-[120px]">{source.title}</span>
                  <ExternalLink className="w-2.5 h-2.5 flex-none" />
                </a>
              ))}
            </div>
          </div>
        )}
        
        {/* Thinking Indicator Badge */}
        {message.isThinking && (
          <div className="mt-2 text-xs text-slate-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse"></span>
            Thinking Mode
          </div>
        )}

        {/* TTS Button (Bot only) */}
        {!isUser && (
          <div className="mt-3 flex items-center justify-end">
            <button
              onClick={handlePlayTTS}
              disabled={isGeneratingAudio || isPlaying}
              className="flex items-center gap-1.5 px-2 py-1 bg-slate-700/50 hover:bg-slate-700 rounded-md text-xs text-slate-300 transition-all active:scale-95"
            >
              {isGeneratingAudio ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : isPlaying ? (
                <Volume2 className="w-3 h-3 text-green-400" />
              ) : (
                <Play className="w-3 h-3" />
              )}
              {isGeneratingAudio ? "Loading..." : isPlaying ? "Playing" : "Listen"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
