import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Bot, Sparkles, X, Send, Loader2, MapPin, Hotel, User, Car, ShoppingBag, ArrowRight, Star, RotateCcw } from 'lucide-react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

// 1. Configuration Imports
import { API_BASE_URL, STORAGE_BASE_URL } from '../../config/runtimeConfig';


// 2. Initialize Gemini 2.5 Flash via Environment Variable
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: `You are Atharaman AI, an expert Sri Lankan travel guide.

STRICT RESPONSE FORMAT:
Your response MUST always be a valid JSON object with two keys:
1. "message": A markdown string with your explanation, tips, and context.
2. "cards": An array of database result objects to display as tiles.

CARD OBJECTS structure:
{ "type": "location"|"hotel"|"guide"|"vehicle"|"shop", "id": <number>, "name": "<string>", "image": "<url or null>", "description": "<short 1-line description>", "rating": <number or null> }

PRIORITY:
1. Search "ACTUAL DATABASE CONTENT" first.
2. Use General Knowledge only if matches are not found.
Return ONLY raw JSON.`
});

const TYPE_CONFIG = {
    location: { icon: MapPin,      color: 'from-orange-400 to-red-500',     bg: 'bg-orange-50',   text: 'text-orange-600',  border: 'border-orange-100', label: 'Location', path: '/locations/' },
    hotel:    { icon: Hotel,       color: 'from-blue-400 to-indigo-500',    bg: 'bg-blue-50',     text: 'text-blue-600',     border: 'border-blue-100',   label: 'Hotel',    path: '/hotels/' },
    guide:    { icon: User,        color: 'from-green-400 to-emerald-500',  bg: 'bg-green-50',    text: 'text-green-600',   border: 'border-green-100',  label: 'Guide',    path: '/guides/' },
    vehicle:  { icon: Car,         color: 'from-purple-400 to-violet-500',  bg: 'bg-purple-50',   text: 'text-purple-600',  border: 'border-purple-100', label: 'Vehicle',  path: '/vehicles/' },
    shop:     { icon: ShoppingBag, color: 'from-pink-400 to-rose-500',      bg: 'bg-pink-50',     text: 'text-pink-600',     border: 'border-pink-100',   label: 'Shop',     path: '/shops/' },
};

// Sub-component for Tiles
const ResultCard = ({ card, onClick }) => {
    const cfg = TYPE_CONFIG[card.type] || TYPE_CONFIG.location;
    const Icon = cfg.icon;

    // Ensure image URL is correct
    const imageUrl = card.image 
        ? (card.image.startsWith('http') ? card.image : `${STORAGE_BASE_URL}/${card.image}`) 
        : null;

    return (
        <div
            onClick={() => onClick(card)}
            style={{ height: '160px' }}
            className={`group cursor-pointer rounded-2xl border ${cfg.border} bg-white overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col`}
        >
            <div className="relative h-[80px] flex-shrink-0 overflow-hidden">
                {imageUrl ? (
                    <img src={imageUrl} alt={card.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${cfg.color} flex items-center justify-center`}>
                        <Icon size={24} className="text-white opacity-80" />
                    </div>
                )}
                <div className={`absolute top-1.5 left-1.5 ${cfg.bg} ${cfg.text} text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border ${cfg.border}`}>
                    {cfg.label}
                </div>
            </div>

            <div className="p-2 flex flex-col justify-between flex-1 overflow-hidden">
                <div>
                    <p className="font-bold text-[11px] text-slate-800 leading-tight line-clamp-1">{card.name}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2 leading-tight h-[28px] overflow-hidden">
                        {card.description || 'Explore this beautiful choice.'}
                    </p>
                </div>
                <div className="flex items-center justify-between">
                    {card.rating ? (
                        <div className="flex items-center gap-0.5">
                            <Star size={8} className="text-amber-400 fill-amber-400" />
                            <span className="text-[10px] font-semibold text-slate-600">{card.rating}</span>
                        </div>
                    ) : <span />}
                    <div className={`${cfg.text} flex items-center gap-0.5 text-[9px] font-bold uppercase tracking-wide`}>
                        View <ArrowRight size={8} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const STORAGE_KEY = 'atharaman_chat';

const AtharamanChat = () => {
    const [isOpen, setIsOpen] = useState(() => {
        try { return JSON.parse(sessionStorage.getItem(STORAGE_KEY))?.isOpen ?? false; } catch { return false; }
    });
    
    const [messages, setMessages] = useState(() => {
        try {
            const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY))?.messages;
            return saved?.length ? saved : [{
                role: 'ai',
                text: 'Ayubowan! I am **Atharaman**. I can help you find the best locations, hotels, and guides in Sri Lanka. What is on your mind?',
                cards: []
            }];
        } catch { return [{ role: 'ai', text: '...', cards: [] }]; }
    });

    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ messages, isOpen })); } catch {}
    }, [messages, isOpen]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleNewChat = () => {
        setMessages([{ role: 'ai', text: 'New conversation started. How can I help you discover Sri Lanka?', cards: [] }]);
    };

    const handleCardClick = (card) => {
        const cfg = TYPE_CONFIG[card.type];
        if (cfg) window.location.href = `${cfg.path}${card.id}`;
    };

    const handleSendMessage = async () => {
        if (!input.trim()) return;
        const userMsg = { role: 'user', text: input, cards: [] };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            // Use API_BASE_URL from runtimeConfig
            const [locs, hotels, guides, vehicles, shops] = await Promise.all([
                axios.get(`${API_BASE_URL}/locations`),
                axios.get(`${API_BASE_URL}/hotels`),
                axios.get(`${API_BASE_URL}/guides`),
                axios.get(`${API_BASE_URL}/vehicles`),
                axios.get(`${API_BASE_URL}/shops`)
            ]);

            const context = `ACTUAL DATABASE CONTENT:
                Locations: ${JSON.stringify(locs.data.slice(0, 10))}
                Hotels: ${JSON.stringify(hotels.data.slice(0, 5))}
                Guides: ${JSON.stringify(guides.data.slice(0, 5))}
                Vehicles: ${JSON.stringify(vehicles.data.slice(0, 5))}
                Shops: ${JSON.stringify(shops.data.slice(0, 5))}`;

            const result = await model.generateContent([context, input]);
            const raw = result.response.text().trim();

            let text = '';
            let cards = [];
            try {
                const match = raw.match(/\{[\s\S]*\}/);
                if (!match) throw new Error('No JSON');
                const parsed = JSON.parse(match[0]);
                text = parsed.message || '';
                cards = Array.isArray(parsed.cards) ? parsed.cards : [];
            } catch {
                text = raw.replace(/[{}]+/g, '').trim(); // Basic cleanup
            }

            setMessages(prev => [...prev, { role: 'ai', text, cards }]);

        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'ai', text: "I'm having trouble connecting. Check your network or Vercel config.", cards: [] }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end font-sans antialiased">
            {isOpen && (
                <div className="mb-4 w-[450px] md:w-[1000px] h-[550px] bg-white rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-300">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 p-5 text-white flex justify-between items-center flex-shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/30">
                                <Bot size={22} />
                            </div>
                            <div>
                                <span className="font-black text-sm tracking-widest uppercase block">ASK Atharaman</span>
                                <div className="flex items-center gap-1.5 text-[9px] font-bold opacity-80 uppercase tracking-widest">
                                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                                    Active Intelligence
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={handleNewChat} className="bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-all"><RotateCcw size={16} /></button>
                            <button onClick={() => setIsOpen(false)} className="bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-all"><X size={20} /></button>
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 p-4 overflow-y-auto bg-[#FDFCFB] flex flex-col gap-4">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'ai' && (
                                    <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 flex-shrink-0 mt-1">
                                        <Bot size={14} />
                                    </div>
                                )}
                                <div className="flex flex-col gap-2 max-w-[85%]">
                                    {msg.text && (
                                        <div className={`p-3.5 rounded-2xl text-[13.5px] leading-relaxed shadow-sm border ${
                                            msg.role === 'user' ? "bg-orange-600 text-white border-orange-500 rounded-br-none" : "bg-white text-slate-700 border-slate-100 rounded-bl-none"
                                        }`}>
                                            <ReactMarkdown components={{
                                                a: ({ ...props }) => <a className="font-bold underline text-orange-500" {...props} />,
                                                p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>
                                            }}>{msg.text}</ReactMarkdown>
                                        </div>
                                    )}
                                    {msg.cards && msg.cards.length > 0 && (
                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mt-1">
                                            {msg.cards.map((card, ci) => (
                                                <ResultCard key={ci} card={card} onClick={handleCardClick} />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex items-center gap-2 ml-9">
                                <Loader2 className="animate-spin text-orange-400" size={14} />
                                <span className="text-[10px] text-slate-400 font-bold uppercase">Atharaman is thinking...</span>
                            </div>
                        )}
                        <div ref={scrollRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 bg-white border-t border-slate-50">
                        <div className="flex items-center gap-2 bg-slate-100 rounded-2xl px-4 py-1 focus-within:bg-white focus-within:ring-2 focus-within:ring-orange-200 transition-all">
                            <input
                                className="flex-1 bg-transparent py-3 text-sm outline-none"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Search places, hotels, guides..."
                            />
                            <button onClick={handleSendMessage} className="text-orange-500 hover:scale-110 active:scale-90 transition-transform">
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Float Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="group relative bg-gradient-to-tr from-orange-500 to-red-600 p-5 rounded-full text-white shadow-xl hover:scale-110 active:scale-90 transition-all duration-300"
            >
                <div className="absolute inset-0 rounded-full bg-orange-400 blur-md opacity-0 group-hover:opacity-50 transition-opacity" />
                <div className="relative flex items-center justify-center">
                    {isOpen ? <X size={28} /> : <Bot size={28} strokeWidth={2.5} />}
                </div>
                {!isOpen && (
                    <span className="absolute right-full mr-5 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-[10px] font-bold px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-slate-700">
                        ✨ ASK ATHARAMAN
                    </span>
                )}
            </button>
        </div>
    );
};

export default AtharamanChat;