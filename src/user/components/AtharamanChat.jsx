import React, { useState, useEffect, useRef } from 'react';
// import { GoogleGenerativeAI } from "@google/generative-ai";
import { Bot, Sparkles, X, Send, Loader2, MapPin, Hotel, User, Car, ShoppingBag, ArrowRight, Star, RotateCcw } from 'lucide-react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';


const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: `You are Atharaman AI, an expert Sri Lankan travel guide.

STRICT RESPONSE FORMAT:
Your response MUST always be a valid JSON object with two keys:
1. "message": A markdown string with your explanation, tips, and context.
2. "cards": An array of database result objects to display as tiles.

CARD OBJECTS must follow this structure exactly:
{ "type": "location"|"hotel"|"guide"|"vehicle"|"shop", "id": <number>, "name": "<string>", "image": "<url or null>", "description": "<short 1-line description>", "rating": <number or null> }

STRICT RESPONSE PRIORITY:
1. DATABASE SEARCH (HIGHEST PRIORITY): Search "ACTUAL DATABASE CONTENT". If matches exist, populate the "cards" array with those items.
2. GENERAL KNOWLEDGE (SECONDARY): If no matches, return an empty "cards" array and answer in "message".

EXAMPLE RESPONSE FORMAT:
{"message": "Here are some great beaches in Sri Lanka!", "cards": [{"type": "location", "id": 5, "name": "Mirissa Beach", "image": "https://...", "description": "Famous for whale watching", "rating": 4.8}]}

IMPORTANT: Return ONLY the raw JSON object. No markdown fences, no extra text.`
});
*/

const TYPE_CONFIG = {
    location: { icon: MapPin,      color: 'from-orange-400 to-red-500',    bg: 'bg-orange-50',   text: 'text-orange-600',  border: 'border-orange-100', label: 'Location', path: '/locations/' },
    hotel:    { icon: Hotel,       color: 'from-blue-400 to-indigo-500',   bg: 'bg-blue-50',     text: 'text-blue-600',    border: 'border-blue-100',   label: 'Hotel',    path: '/hotels/' },
    guide:    { icon: User,        color: 'from-green-400 to-emerald-500', bg: 'bg-green-50',    text: 'text-green-600',   border: 'border-green-100',  label: 'Guide',    path: '/guides/' },
    vehicle:  { icon: Car,         color: 'from-purple-400 to-violet-500', bg: 'bg-purple-50',   text: 'text-purple-600',  border: 'border-purple-100', label: 'Vehicle',  path: '/vehicles/' },
    shop:     { icon: ShoppingBag, color: 'from-pink-400 to-rose-500',     bg: 'bg-pink-50',     text: 'text-pink-600',    border: 'border-pink-100',   label: 'Shop',     path: '/shops/' },
};

const ResultCard = ({ card, onClick }) => {
    const cfg = TYPE_CONFIG[card.type] || TYPE_CONFIG.location;
    const Icon = cfg.icon;

    return (
        <div
            onClick={() => onClick(card)}
            style={{ height: '160px' }}
            className={`group cursor-pointer rounded-2xl border ${cfg.border} bg-white overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col`}
        >
            {/* Image — fixed height */}
            <div className="relative h-[80px] flex-shrink-0 overflow-hidden">
                {card.image ? (
                    <img src={card.image} alt={card.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${cfg.color} flex items-center justify-center`}>
                        <Icon size={24} className="text-white opacity-80" />
                    </div>
                )}
                <div className={`absolute top-1.5 left-1.5 ${cfg.bg} ${cfg.text} text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border ${cfg.border}`}>
                    {cfg.label}
                </div>
            </div>

            {/* Content — fills remaining fixed space */}
            <div className="p-2 flex flex-col justify-between flex-1 overflow-hidden">
                <div>
                    <p className="font-bold text-[11px] text-slate-800 leading-tight line-clamp-1">{card.name}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2 leading-tight h-[28px] overflow-hidden">
                        {card.description || ' '}
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
        } catch {
            return [{
                role: 'ai',
                text: 'Ayubowan! I am **Atharaman**. I can help you find the best locations, hotels, and guides in Sri Lanka. What is on your mind?',
                cards: []
            }];
        }
    });
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);

    // Persist messages + isOpen to sessionStorage on every change
    useEffect(() => {
        try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ messages, isOpen })); } catch {}
    }, [messages, isOpen]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const INITIAL_MESSAGE = { role: 'ai', text: 'Ayubowan! I am **Atharaman**. I can help you find the best locations, hotels, and guides in Sri Lanka. What is on your mind?', cards: [] };

    const handleNewChat = () => {
        sessionStorage.removeItem(STORAGE_KEY);
        setMessages([INITIAL_MESSAGE]);
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
            const [locs, hotels, guides, vehicles, shops] = await Promise.all([
                axios.get('http://127.0.0.1:8000/api/locations'),
                axios.get('http://127.0.0.1:8000/api/hotels'),
                axios.get('http://127.0.0.1:8000/api/guides'),
                axios.get('http://127.0.0.1:8000/api/vehicles'),
                axios.get('http://127.0.0.1:8000/api/shops')
            ]);

            const context = `ACTUAL DATABASE CONTENT:
                Locations: ${JSON.stringify(locs.data.slice(0, 10))}
                Hotels: ${JSON.stringify(hotels.data.slice(0, 5))}
                Guides: ${JSON.stringify(guides.data.slice(0, 5))}
                Vehicles: ${JSON.stringify(vehicles.data.slice(0, 5))}
                Shops: ${JSON.stringify(shops.data.slice(0, 5))}`;

            /*
            const result = await model.generateContent([context, input]);
            const raw = result.response.text().trim();
            */
            const raw = '{"message": "AI Chat is currently disabled for maintenance.", "cards": []}';

            let text = '';
            let cards = [];
            try {
                // Extract first {...} block — handles trailing pipes, fences, extra chars
                const match = raw.match(/\{[\s\S]*\}/);
                if (!match) throw new Error('No JSON found');
                const parsed = JSON.parse(match[0]);
                text = parsed.message || '';
                cards = Array.isArray(parsed.cards) ? parsed.cards : [];
            } catch {
                // Fallback: strip raw JSON scaffolding and show clean text
                text = raw
                    .replace(/^```json\s*/i, '').replace(/```\s*$/i, '')
                    .replace(/^\{?\s*"message"\s*:\s*"/i, '')
                    .replace(/",?\s*"cards"\s*:[\s\S]*$/i, '')
                    .replace(/[|}]+$/, '')
                    .trim();
            }

            setMessages(prev => [...prev, { role: 'ai', text, cards }]);

        } catch (error) {
            console.error(error);
            let errorMsg = "I'm having trouble connecting right now. Please try again.";
            if (error.message?.includes("429")) errorMsg = "⚠️ Too many requests. Please wait a moment.";
            setMessages(prev => [...prev, { role: 'ai', text: errorMsg, cards: [] }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end font-sans antialiased">

            {/* ── Chat Window ── */}
            {isOpen && (
                <div className="mb-4 w-[1000px] h-[500px] bg-white rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-300">

                    {/* Header */}
                    <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 p-5 text-white flex justify-between items-center flex-shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/30">
                                <Bot size={22} />
                            </div>
                            <div>
                                <span className="font-black text-sm tracking-widest uppercase block">ASK Atharaman</span>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                                    <span className="text-[9px] font-bold opacity-80 uppercase tracking-widest">Active Intelligence</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={handleNewChat} title="New chat" className="hover:rotate-180 transition-transform duration-300 bg-white/10 hover:bg-white/20 p-1.5 rounded-full">
                                <RotateCcw size={16} />
                            </button>
                            <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform bg-white/10 p-1.5 rounded-full">
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-4 overflow-y-auto bg-[#FDFCFB] flex flex-col gap-4">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'ai' && (
                                    <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 flex-shrink-0 mt-1">
                                        <Bot size={14} />
                                    </div>
                                )}

                                <div className={`flex flex-col gap-2 max-w-[85%]`}>
                                    {/* Bubble */}
                                    {msg.text && (
                                        <div className={`p-3.5 rounded-2xl text-[13px] leading-relaxed ${
                                            msg.role === 'user'
                                                ? "bg-orange-600 text-white rounded-br-none shadow-lg shadow-orange-100"
                                                : "bg-white text-slate-700 rounded-bl-none border border-slate-100 shadow-sm"
                                        }`}>
                                            <ReactMarkdown components={{
                                                a: ({ node, ...props }) => (
                                                    <a href={props.href} className="font-bold underline text-orange-500 hover:text-red-500">{props.children}</a>
                                                ),
                                                h3: ({ children }) => <h3 className="font-black text-orange-600 text-xs mt-2 mb-1 uppercase tracking-tight">{children}</h3>,
                                                li: ({ children }) => <li className="ml-4 list-disc marker:text-orange-400 mb-0.5">{children}</li>,
                                                p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
                                            }}>
                                                {msg.text}
                                            </ReactMarkdown>
                                        </div>
                                    )}

                                    {/* ── Result Cards ── */}
                                    {msg.cards && msg.cards.length > 0 && (() => {
                                        const visible = msg.cards.slice(0, 4);
                                        const extra = msg.cards.length - 4;
                                        // Determine dominant type for "see more" link
                                        const dominantType = msg.cards[0]?.type || 'location';
                                        const cfg = TYPE_CONFIG[dominantType] || TYPE_CONFIG.location;
                                        return (
                                            <div className="flex flex-col gap-2">
                                                <div className="grid grid-cols-4 gap-2">
                                                    {visible.map((card, ci) => (
                                                        <ResultCard key={ci} card={card} onClick={handleCardClick} />
                                                    ))}
                                                </div>
                                                {extra > 0 && (
                                                    <button
                                                        onClick={() => window.location.href = cfg.path}
                                                        className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl border ${cfg.border} ${cfg.bg} ${cfg.text} text-[11px] font-bold uppercase tracking-wider hover:opacity-80 transition-opacity`}
                                                    >
                                                        <span>+{extra} more {dominantType}s</span>
                                                        <ArrowRight size={12} />
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })()}
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="flex items-center gap-2 ml-9">
                                <Loader2 className="animate-spin text-orange-400" size={14} />
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Atharaman is thinking...</span>
                            </div>
                        )}
                        <div ref={scrollRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 bg-white border-t border-slate-50 flex-shrink-0">
                        <div className="flex items-center gap-2 bg-slate-100 rounded-2xl px-4 py-1 focus-within:bg-white focus-within:ring-2 focus-within:ring-orange-200 transition-all">
                            <input
                                className="flex-1 bg-transparent py-3 text-sm outline-none text-slate-700 placeholder:text-slate-400"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Ask about places, guides, or hotels..."
                            />
                            <button onClick={handleSendMessage} className="text-orange-500 hover:scale-110 active:scale-90 transition-transform">
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Toggle Button ── */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="group relative bg-gradient-to-tr from-orange-500 to-red-600 p-5 rounded-full text-white shadow-[0_15px_35px_rgba(249,115,22,0.4)] hover:scale-110 active:scale-90 transition-all duration-300"
            >
                <div className="absolute inset-0 rounded-full bg-orange-400 blur-md opacity-0 group-hover:opacity-50 transition-opacity" />
                <div className="relative flex items-center justify-center">
                    {isOpen ? <X size={28} /> : (
                        <>
                            <Bot size={28} strokeWidth={2.5} />
                            <Sparkles size={14} className="absolute -top-1 -right-1 text-yellow-200 animate-pulse" />
                        </>
                    )}
                </div>
                {!isOpen && (
                    <span className="absolute right-full mr-5 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-[10px] font-bold px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-2xl border border-slate-700">
                        ✨ ASK ATHARAMAN
                    </span>
                )}
            </button>
        </div>
    );
};

export default AtharamanChat;