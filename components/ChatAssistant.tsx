import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, X, MessageSquare, Loader2 } from 'lucide-react';
import { ChatMessage } from '../types';
import { sendMessageToGemini } from '../services/geminiService';

const ChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Hello! I am your Infrastructure Insights Assistant. Ask me about the bottlenecks in the Student Management App or the Voting App.',
      timestamp: new Date()
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await sendMessageToGemini(userMsg.text);
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      {/* Chat Window */}
      <div 
        className={`
          pointer-events-auto bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl 
          w-80 sm:w-96 transition-all duration-300 overflow-hidden flex flex-col
          ${isOpen ? 'opacity-100 translate-y-0 h-[500px]' : 'opacity-0 translate-y-10 h-0'}
        `}
      >
        {/* Header */}
        <div className="bg-slate-900 p-4 border-b border-slate-700 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-primary-600 p-1.5 rounded-lg">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-semibold text-white">Infra Assistant</h3>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-800">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`
                  max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed
                  ${msg.role === 'user' 
                    ? 'bg-primary-600 text-white rounded-br-none' 
                    : 'bg-slate-700 text-slate-200 rounded-bl-none'}
                `}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-700 text-slate-200 p-3 rounded-2xl rounded-bl-none flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-xs">Analyzing architecture...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-3 bg-slate-900 border-t border-slate-700 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about cold starts..."
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-primary-500"
          />
          <button 
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-primary-600 text-white p-2 rounded-xl hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`
          pointer-events-auto mt-4 p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-105
          ${isOpen ? 'bg-slate-700 text-slate-300' : 'bg-primary-600 text-white'}
        `}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>
    </div>
  );
};

export default ChatAssistant;