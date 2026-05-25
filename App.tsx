import React, { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, Camera, X, Loader2, Sparkles, Wand2, Key, Check, Info, ExternalLink } from 'lucide-react';
import { Message, Sender } from './types';
import { generateResponse, getApiKey } from './services/geminiService';
import MessageBubble from './components/MessageBubble';
import SettingsPanel from './components/SettingsPanel';
import ShareButton from './components/ShareButton';
import InstallButton from './components/InstallButton';

const STORAGE_KEY = 'achille_chat_history';

const INITIAL_MESSAGE: Message = {
  id: '1',
  text: "Hello! I'm ACHILLE, your AI assistant. I've been updated with Nano Banana 🍌 image generation. Try switching modes below!",
  sender: Sender.Bot,
  timestamp: Date.now()
};

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [INITIAL_MESSAGE];
  });
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // Settings State
  const [useThinking, setUseThinking] = useState(false);
  const [useLite, setUseLite] = useState(true);
  const [isBananaMode, setIsBananaMode] = useState(false);
  const [useSearch, setUseSearch] = useState(false);
  const [useCode, setUseCode] = useState(false);
  
  const [hasApiKey, setHasApiKey] = useState(() => !!getApiKey());
  const [tempKey, setTempKey] = useState('');

  const handleSaveTempKey = () => {
    const trimmed = tempKey.trim();
    if (trimmed) {
      localStorage.setItem('achille_custom_api_key', trimmed);
      setHasApiKey(true);
      setTempKey('');
    }
  };

  useEffect(() => {
    const checkKey = () => {
      setHasApiKey(!!getApiKey());
    };
    window.addEventListener('storage', checkKey);
    const interval = setInterval(checkKey, 500);
    return () => {
      window.removeEventListener('storage', checkKey);
      clearInterval(interval);
    };
  }, []);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    scrollToBottom();
  }, [messages]);

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear your entire chat history?")) {
      setMessages([INITIAL_MESSAGE]);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const handleSendMessage = async () => {
    if ((!inputText.trim() && !selectedImage) || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: Sender.User,
      timestamp: Date.now(),
      image: selectedImage || undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setSelectedImage(null);
    setIsLoading(true);

    try {
      const result = await generateResponse(userMessage.text || (userMessage.image ? "Enhance this image" : "Generate a beautiful landscape"), {
        useThinking,
        useLite,
        useSearch,
        useCode,
        image: userMessage.image,
        isBananaMode
      });

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: result.text || (result.image ? "Here is your generated image 🍌" : "Success!"),
        sender: Sender.Bot,
        timestamp: Date.now(),
        image: result.image,
        sources: result.sources,
        isThinking: useThinking && !isBananaMode
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Something went wrong. The model might be busy. Please try again.",
        sender: Sender.Bot,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={`flex flex-col h-full bg-slate-950 text-slate-100 font-sans transition-colors duration-500 ${isBananaMode ? 'selection:bg-yellow-500/30' : ''}`}>
      {/* Header */}
      <header className={`flex-none p-4 backdrop-blur-md border-b flex items-center justify-between sticky top-0 z-10 transition-colors ${isBananaMode ? 'bg-yellow-900/20 border-yellow-500/30' : 'bg-slate-900/80 border-slate-800'}`}>
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isBananaMode ? 'bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.5)]' : 'bg-gradient-to-br from-blue-500 to-purple-600'}`}>
            {isBananaMode ? <span className="text-lg">🍌</span> : <Sparkles className="w-5 h-5 text-white" />}
          </div>
          <h1 className="font-bold text-lg tracking-tight">
            ACHILLE <span className={isBananaMode ? 'text-yellow-400' : ''}>Ai</span>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <InstallButton />
          <ShareButton />
        </div>
      </header>

      {/* Messages Area */}
      <main className="flex-1 overflow-y-auto p-4 scroll-smooth no-scrollbar">
        <div className="max-w-3xl mx-auto flex flex-col gap-2">
          {/* API Key Banner Indicator */}
          {!hasApiKey && (
            <div className="bg-gradient-to-r from-red-950/40 to-indigo-950/40 border border-red-500/30 rounded-2xl p-5 mb-4 shadow-xl backdrop-blur-md">
              <div className="flex flex-col md:flex-row items-start gap-4">
                <div className="p-3 bg-red-400/10 rounded-xl border border-red-500/30 text-red-400 flex-shrink-0 animate-pulse">
                  <Key className="w-6 h-6" />
                </div>
                <div className="flex-1 space-y-3">
                  <h3 className="font-bold text-slate-200 text-base flex items-center gap-2">
                    Gemini API Key Needed
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    ACHILLE requires a Gemini API key to operate on Netlify. Add one temporarily below, or configure it on Netlify to make it permanent for everyone!
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-2 max-w-xl">
                    <input
                      type="password"
                      placeholder="Paste your Gemini API Key here (AIzaSy...)"
                      value={tempKey}
                      onChange={(e) => setTempKey(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-slate-200 placeholder-slate-600 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                    <button
                      onClick={handleSaveTempKey}
                      className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg active:scale-95 flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-4 h-4" /> Save
                    </button>
                  </div>

                  <div className="pt-2 border-t border-slate-900 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 text-indigo-400" />
                      Saved securely in your browser's local storage.
                    </span>
                    <a
                      href="https://aistudio.google.com/app/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-400 hover:underline inline-flex items-center gap-1"
                    >
                      Get free Key <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className={`bg-slate-800 rounded-2xl rounded-bl-none p-4 border flex items-center gap-3 transition-colors ${isBananaMode ? 'border-yellow-500/50' : 'border-slate-700'}`}>
                <Loader2 className={`w-5 h-5 animate-spin ${isBananaMode ? 'text-yellow-400' : 'text-blue-400'}`} />
                <span className="text-slate-400 text-sm">
                  {isBananaMode ? "Peeling the banana... (Generating Image)" : useThinking ? "Thinking deeply..." : "Synthesizing..."}
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Controls & Input */}
      <footer className="flex-none bg-slate-950/90 backdrop-blur-sm sticky bottom-0 z-20">
        
        <SettingsPanel 
          useThinking={useThinking} 
          setUseThinking={setUseThinking}
          useLite={useLite}
          setUseLite={setUseLite}
          useSearch={useSearch}
          setUseSearch={setUseSearch}
          useCode={useCode}
          setUseCode={setUseCode}
          isBananaMode={isBananaMode}
          setIsBananaMode={setIsBananaMode}
          onClearHistory={handleClearHistory}
        />

        {selectedImage && (
          <div className={`px-4 py-2 flex items-center gap-2 bg-slate-900/50 backdrop-blur-sm border-t ${isBananaMode ? 'border-yellow-500/30' : 'border-slate-800'}`}>
            <div className="relative inline-block">
              <img src={selectedImage} alt="Selected" className={`h-16 w-16 object-cover rounded-lg border shadow-lg ${isBananaMode ? 'border-yellow-500' : 'border-slate-700'}`} />
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute -top-2 -right-2 bg-red-500 rounded-full p-0.5 text-white shadow-md hover:bg-red-600 active:scale-90 transition-transform"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              {isBananaMode ? "Image selected for Editing 🍌" : "Image ready for analysis"}
            </span>
          </div>
        )}

        <div className="p-4 pt-2 max-w-3xl mx-auto">
          <div className={`flex gap-1.5 items-end bg-slate-900 border rounded-2xl p-2 transition-all shadow-lg focus-within:ring-2 ${isBananaMode ? 'border-yellow-500/50 focus-within:ring-yellow-500/30' : 'border-slate-800 focus-within:ring-blue-500/50 focus-within:border-blue-500'}`}>
            
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-xl transition-colors"
              title="Gallery"
            >
              <ImageIcon className="w-5 h-5" />
            </button>
            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageSelect} />

            <button 
              onClick={() => cameraInputRef.current?.click()}
              className="p-2.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-xl transition-colors"
              title="Camera"
            >
              <Camera className="w-5 h-5" />
            </button>
            <input type="file" accept="image/*" capture="environment" className="hidden" ref={cameraInputRef} onChange={handleImageSelect} />

            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isBananaMode ? "Describe the image you want..." : useThinking ? "Ask a complex question..." : useSearch ? "Search the web for..." : useCode ? "Let's write and run some code..." : "Message ACHILLE..."}
              className="flex-1 bg-transparent border-none text-slate-100 placeholder-slate-500 focus:ring-0 resize-none max-h-32 py-2.5 text-base"
              rows={1}
              style={{ minHeight: '40px' }}
            />

            <button
              onClick={handleSendMessage}
              disabled={(!inputText.trim() && !selectedImage) || isLoading}
              className={`p-2.5 rounded-xl transition-all ${
                (!inputText.trim() && !selectedImage) || isLoading
                  ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                  : isBananaMode 
                    ? 'bg-yellow-500 text-slate-900 hover:bg-yellow-400 shadow-yellow-500/20 active:scale-95'
                    : 'bg-blue-600 text-white hover:bg-blue-500 shadow-md shadow-blue-500/20 active:scale-95'
              }`}
            >
              {isBananaMode ? <Wand2 className="w-5 h-5" /> : <Send className="w-5 h-5" />}
            </button>
          </div>
          <div className="text-center mt-2">
            <p className={`text-[10px] uppercase tracking-widest font-bold transition-colors ${isBananaMode ? 'text-yellow-500' : 'text-slate-600'}`}>
               {isBananaMode ? 'Nano Banana Image Engine' : useThinking ? 'Gemini 3 Pro Deep Research' : (useSearch || useCode) ? 'Tools Enabled: ' + [useSearch && 'Search', useCode && 'Code'].filter(Boolean).join(' + ') : 'Gemini Ultra Fast Mode'}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;