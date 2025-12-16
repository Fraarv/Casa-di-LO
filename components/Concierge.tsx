import React, { useState, useRef, useEffect } from 'react';
import { generateConciergeResponse } from '../services/geminiService';
import { ChatMessage, GroundingChunk } from '../types';
import { Send, MapPin, Search, Loader2, Navigation } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const Concierge: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Benvenuti! I am your AI concierge for La Casa di LO. Ask me about the best restaurants in Monopoli, local beaches, or how to get to the house!",
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<GeolocationCoordinates | undefined>(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Attempt to get location for better Maps results
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => setUserLocation(position.coords),
        (error) => console.log('Location access denied, defaulting to general query')
      );
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await generateConciergeResponse(input, userLocation);
      const text = response.text || "I couldn't find that information right now.";
      
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] | undefined;

      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: text,
        groundingMetadata: groundingChunks ? { groundingChunks } : undefined
      };
      
      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: 'model', 
        text: "Scusami! I encountered an error connecting to the service. Please try again." 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const renderSources = (chunks?: GroundingChunk[]) => {
    if (!chunks || chunks.length === 0) return null;

    // Filter for unique URLs to avoid duplicates
    const uniqueSources = new Map();
    
    chunks.forEach(chunk => {
        if (chunk.web) {
            uniqueSources.set(chunk.web.uri, { ...chunk.web, type: 'web' });
        } else if (chunk.maps) {
            uniqueSources.set(chunk.maps.uri, { ...chunk.maps, type: 'maps' });
        }
    });

    return (
      <div className="mt-3 flex flex-wrap gap-2">
        {Array.from(uniqueSources.values()).map((source: any, idx) => (
          <a
            key={idx}
            href={source.uri}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/50 hover:bg-white border border-puglia-sea/20 rounded-full text-xs text-puglia-sea transition-all shadow-sm"
          >
            {source.type === 'maps' ? <MapPin size={12} /> : <Search size={12} />}
            <span className="truncate max-w-[150px]">{source.title}</span>
          </a>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-puglia-stone/30 rounded-xl border border-stone-200 overflow-hidden shadow-lg h-[600px] flex flex-col">
      <div className="bg-puglia-sea text-white p-4 flex items-center justify-between">
        <h3 className="font-serif text-xl italic">Concierge Digitale</h3>
        {userLocation && <Navigation size={16} className="text-white/70" />}
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-4 ${
              msg.role === 'user' 
                ? 'bg-puglia-sea text-white rounded-br-none' 
                : 'bg-white text-gray-800 border border-stone-100 rounded-bl-none shadow-sm'
            }`}>
              <div className="prose prose-sm prose-stone dark:prose-invert max-w-none">
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
              {renderSources(msg.groundingMetadata?.groundingChunks)}
            </div>
          </div>
        ))}
        {loading && (
            <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-stone-100 shadow-sm flex items-center gap-2">
                    <Loader2 className="animate-spin text-puglia-sea" size={16} />
                    <span className="text-xs text-gray-500">Thinking...</span>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-stone-100">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Search nearby restaurants, museums, etc..."
            className="flex-1 border border-stone-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-puglia-sea/50 bg-stone-50"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-puglia-sea hover:bg-puglia-sea/90 text-white p-2 rounded-lg transition-colors disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
