import React, { useState, useRef, useEffect } from 'react';
import MessageCard from './MessageCard';
import { Send, ArrowDown } from 'lucide-react';
import Loading from './Loading';

const ChatBox = ({ messages, onSendMessage, loading }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll to bottom whenever messages list changes or loading state triggers
  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Monitor scroll height to show a "scroll to bottom" helper button if scrolled up
  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    // Show button if user is scrolled up more than 300px
    const isScrolledUp = scrollHeight - scrollTop - clientHeight > 300;
    setShowScrollBtn(isScrolledUp);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const handleKeyDown = (e) => {
    // Submit on Enter, allow normal newline on Shift + Enter
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="relative flex flex-col h-full bg-slate-900/40 border border-white/5 rounded-3xl overflow-hidden shadow-2xl glass">
      
      {/* CHAT MESSAGES DISPLAY PANEL */}
      <div
        ref={chatContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 md:px-6 py-4 space-y-2"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
            <div className="p-4 bg-green-500/10 rounded-full border border-green-500/20 text-green-400">
              <Send className="h-8 w-8 animate-pulse" />
            </div>
            <h3 className="font-bold text-slate-200 text-lg">AI Assistant Active</h3>
            <p className="text-slate-400 text-sm max-w-sm">
              Hello! I'm your customer support assistant. You can ask me billing, account, or technical questions.
            </p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isAI = !!msg.response || msg.isAI;
            return (
              <MessageCard
                key={msg.id || idx}
                message={isAI ? (msg.response || msg.message || msg.text) : (msg.message || msg.text)}
                isAI={isAI}
                category={msg.category}
                timestamp={msg.timestamp}
              />
            );
          })
        )}
        
        {/* Loading placeholder when backend/AI generates reply */}
        {loading && (
          <div className="flex justify-start items-center space-x-2 py-3 px-4 bg-slate-900/50 w-fit rounded-2xl border border-white/5 mt-4">
            <Loading size="sm" text="Assistant is typing..." />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* FLOAT SCROLL TO BOTTOM BUTTON */}
      {showScrollBtn && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-24 right-6 p-2.5 rounded-full bg-green-500 text-white shadow-xl hover:bg-green-600 border border-green-400/20 transition-all duration-300 hover:scale-105 cursor-pointer z-10"
        >
          <ArrowDown className="h-4 w-4 animate-bounce" />
        </button>
      )}

      {/* FOOTER: MESSAGE TYPING CONSOLE */}
      <form
        onSubmit={handleSubmit}
        className="p-4 border-t border-white/5 bg-slate-950/70 flex items-center space-x-3"
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your question here (Press Enter to send)..."
          rows={1}
          className="flex-1 bg-slate-900 border border-white/10 hover:border-white/20 focus:border-green-500 focus:ring-1 focus:ring-green-500/20 text-slate-100 text-sm rounded-xl py-3 px-4 resize-none focus:outline-none transition-all max-h-24 min-h-[46px]"
        />

        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="p-3.5 bg-green-500 hover:bg-green-600 disabled:bg-slate-800 text-slate-950 disabled:text-slate-500 rounded-xl transition-all duration-200 flex-shrink-0 cursor-pointer hover:scale-102 active:scale-98 shadow-lg shadow-green-500/10"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
