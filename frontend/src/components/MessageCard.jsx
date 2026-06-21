import React from 'react';
import { User, Sparkles } from 'lucide-react';

const MessageCard = ({ message, isAI = false, category = 'General', timestamp }) => {
  const formattedTime = timestamp
    ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Color mappings for category tags
  const categoryColors = {
    Technical: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    Billing: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    Account: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    General: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  };

  const currentCategoryColor = categoryColors[category] || categoryColors.General;

  return (
    <div className={`flex w-full mt-4 ${isAI ? 'justify-start' : 'justify-end'}`}>
      <div className={`flex items-start max-w-[80%] space-x-3 ${!isAI && 'flex-row-reverse space-x-reverse'}`}>
        
        {/* AVATAR */}
        <div className={`p-2 rounded-xl flex-shrink-0 border ${
          isAI 
            ? 'bg-green-500/15 border-green-500/30 text-green-400 animate-pulse' 
            : 'bg-slate-800 border-white/5 text-slate-300'
        }`}>
          {isAI ? <Sparkles className="h-4 w-4" /> : <User className="h-4 w-4" />}
        </div>

        {/* MESSAGE BUBBLE */}
        <div className="flex flex-col">
          <div className={`px-4 py-3 rounded-2xl border text-sm leading-relaxed shadow-lg ${
            isAI 
              ? 'bg-slate-900/90 border-white/5 text-slate-100 rounded-tl-none' 
              : 'bg-green-600/90 border-green-500/50 text-white rounded-tr-none'
          }`}>
            <p className="whitespace-pre-line">{message}</p>
          </div>
          
          {/* METADATA */}
          <div className={`flex items-center space-x-2 mt-1.5 text-[11px] text-slate-400 ${!isAI && 'justify-end'}`}>
            <span>{formattedTime}</span>
            {isAI && (
              <>
                <span>•</span>
                <span className={`px-2 py-0.5 rounded-full border text-[10px] uppercase font-bold tracking-wider ${currentCategoryColor}`}>
                  {category}
                </span>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default MessageCard;
