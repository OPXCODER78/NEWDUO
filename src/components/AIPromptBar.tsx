import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LoaderCircle, ArrowUp } from 'lucide-react';

interface AIPromptBarProps {
  isLoading: boolean;
  onSendPrompt: (prompt: string) => void;
}

const AIPromptBar: React.FC<AIPromptBarProps> = ({ isLoading, onSendPrompt }) => {
  const [prompt, setPrompt] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSend = () => {
    if (prompt.trim() && !isLoading) {
      onSendPrompt(prompt);
      setPrompt('');
    }
  };

  const isExpanded = isFocused || prompt.length > 0;

  return (
    <motion.div
      layout
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="flex items-center h-12 bg-quantum-ai-bg rounded-full shadow-2xl overflow-hidden"
      style={{ width: isExpanded ? 'min(600px, 80vw)' : 197 }}
    >
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        placeholder="Ask OUART"
        disabled={isLoading}
        className="flex-grow h-full pl-6 pr-2 bg-transparent border-none outline-none text-[12.2px] text-quantum-gray-light placeholder:text-quantum-ai-text font-bold"
      />
      <button
        onClick={handleSend}
        disabled={isLoading || !prompt.trim()}
        className="flex-shrink-0 w-12 h-12 flex items-center justify-center disabled:cursor-not-allowed group"
      >
        {isLoading ? (
          <LoaderCircle className="animate-spin text-white" size={24} />
        ) : (
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-quantum-ai-text group-hover:bg-quantum-gray-light transition-all group-disabled:bg-opacity-50">
             <ArrowUp size={20} className="text-quantum-dark" />
          </div>
        )}
      </button>
    </motion.div>
  );
};

export default AIPromptBar;
