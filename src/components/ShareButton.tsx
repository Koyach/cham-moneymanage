import React, { useState } from 'react';
import { AppState } from '../types';
import { generateShareUrl } from '../utils/urlState';
import { Share2, Check } from 'lucide-react';

interface ShareButtonProps {
  state: AppState;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ state }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      const url = generateShareUrl(state);
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all transform hover:scale-105 flex items-center justify-center group z-50"
      aria-label="リンクをコピー"
    >
      {copied ? (
        <Check className="w-6 h-6" />
      ) : (
        <Share2 className="w-6 h-6" />
      )}
      
      {/* Tooltip */}
      <span className="absolute right-full mr-4 bg-gray-800 text-white text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        {copied ? 'コピーしました！' : 'リンクをコピーして共有'}
      </span>
    </button>
  );
};
