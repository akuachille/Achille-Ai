import React, { useState } from 'react';
import { Share2, Link, Check } from 'lucide-react';

const ShareButton: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    const title = "Download ACHILLE Ai";
    const text = `Get ACHILLE Ai on your phone! It's a powerful offline-capable AI assistant. Download here: ${url}`;

    if (navigator.share) {
      // Use Native Web Share API (Mobile standard)
      try {
        await navigator.share({
          title,
          text: `Download ACHILLE Ai here:`,
          url
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(`${text}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        // Fallback to WhatsApp if clipboard fails
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(whatsappUrl, '_blank');
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`flex items-center gap-2 p-2 px-3 rounded-full border transition-all duration-300 ${
        copied 
          ? 'bg-green-900/50 border-green-500 text-green-400' 
          : 'bg-slate-800 border-slate-700 text-blue-400 hover:bg-slate-700 hover:border-slate-600'
      }`}
      title={copied ? "Link Copied!" : "Share Download Link"}
    >
      {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
      <span className="text-xs font-medium hidden sm:inline">
        {copied ? 'Copied!' : 'Share'}
      </span>
    </button>
  );
};

export default ShareButton;