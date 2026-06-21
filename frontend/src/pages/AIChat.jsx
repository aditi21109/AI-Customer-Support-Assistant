import React, { useState, useEffect } from 'react';
import ChatBox from '../components/ChatBox';
import { chatService } from '../services/api';
import { Sparkles, MessageSquare, AlertCircle } from 'lucide-react';
import Loading from '../components/Loading';

const AIChat = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch previous messages on component mount
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const history = await chatService.getHistory();
        setMessages(history);
      } catch (err) {
        console.error('Failed to load chat logs:', err);
        setError('Could not load chat history. Please refresh the page.');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchChatHistory();
  }, []);

  const handleSendMessage = async (text) => {
    setError('');
    
    // Create optimistic user message object
    const userMessage = {
      message: text,
      response: '', // Empty means user message
      timestamp: new Date().toISOString(),
    };

    // Optimistically update frontend state
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const responseData = await chatService.sendMessage(text);
      // Update state with actual backend response (contains category, timestamp)
      setMessages((prev) => {
        // Replace the last temporary user message with the verified one
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...userMessage,
          id: responseData.id + '_user',
        };
        // Append AI response
        return [
          ...updated,
          {
            id: responseData.id,
            message: responseData.message,
            response: responseData.response,
            category: responseData.category,
            timestamp: responseData.timestamp,
          },
        ];
      });
    } catch (err) {
      console.error('Failed to submit chat message:', err);
      setError('Failed to receive response from AI. Please try again.');
      // Remove the optimistic message if it failed
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070b13]">
        <Loading size="lg" text="Loading AI Support console..." />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-65px)] bg-[#070b13] flex flex-col px-4 md:px-8 py-6 pb-20 md:pb-6">
      <div className="max-w-5xl w-full mx-auto flex-1 flex flex-col space-y-4 overflow-hidden">
        
        {/* HEADER AREA */}
        <div className="flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-500/10 border border-green-500/25 rounded-xl text-green-400">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-1.5">
                <span>AI Customer Support Agent</span>
                <Sparkles className="h-4 w-4 text-green-400 animate-pulse" />
              </h1>
              <p className="text-xs text-slate-400">Powered by Gemini 1.5 Flash • Context aware assistance</p>
            </div>
          </div>
        </div>

        {/* ERROR DISPLAY */}
        {error && (
          <div className="flex items-center space-x-2 bg-red-950/40 border border-red-500/25 text-red-200 px-4 py-2 rounded-xl text-xs flex-shrink-0">
            <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* CHAT INTERFACE BOX */}
        <div className="flex-1 min-h-0">
          <ChatBox
            messages={messages}
            onSendMessage={handleSendMessage}
            loading={loading}
          />
        </div>

      </div>
    </div>
  );
};

export default AIChat;
