"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Sprout, X, Send, Sparkles, Bot, User, Minimize2 } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { ChatMessage } from "../../lib/types";

export default function FloatingAssistant() {
  const { language, t } = useLanguage();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Hide floating assistant inside /admin
  const isAdmin = pathname?.startsWith("/admin");

  // Initial greeting based on locale
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content:
            language === "bn"
              ? "নমস্কার ও স্বাগতম! আমি অরণ্যক—আপনার ব্যক্তিগত প্রকৃতি ও ভেষজ বিশেষজ্ঞ। গাছের যত্ন, ওষধি পাতার গুণাগুণ বা পরিবেশবান্ধব জীবনধারা সম্পর্কিত যেকোনো প্রশ্ন করতে পারেন।"
              : "Greetings! I am Aronyok—your dedicated nature and herbal guide. Ask me anything about medicinal plants, gardening tips, or organic remedies.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [language, messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (isAdmin) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          language,
        }),
      });

      const data = await response.json();

      if (response.ok && data.reply) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } else {
        throw new Error(data.error || "Failed to get response");
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            language === "bn"
              ? "দুঃখিত, সংযোগে সামান্য বিঘ্ন ঘটেছে। তবে তুলসী, নিম, মধু বা গাছের যত্ন বিষয়ে কিছু জানতে চাইলে আবার চেষ্টা করুন।"
              : "I apologize, a temporary connection hiccup occurred. Please feel free to re-ask your herbal or gardening question.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts =
    language === "bn"
      ? [
          "সর্দি-কাশিতে তুলসীর ব্যবহার কীভাবে করবেন?",
          "বারান্দার গাছে পোকা দূর করতে নিম তেলের নিয়ম কী?",
          "সুন্দরবনের খাঁটি মধুর স্বাস্থ্য উপকারিতা কী?",
        ]
      : [
          "How to use Tulsi for colds and respiratory relief?",
          "How to safely apply cold-pressed Neem oil to plants?",
          "What are the benefits of Sundarbans raw honey?",
        ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Trigger Bubble */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-forest-800 via-forest-700 to-forest-500 text-cream-50 shadow-soft-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ring-4 ring-forest-400/20"
          aria-label="Open Aronyok Nature AI Assistant"
        >
          <Sprout className="w-7 h-7 text-mint-300 stroke-[2.2] animate-bounce-subtle" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mint-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-mint-500 border-2 border-white"></span>
          </span>
          {/* Hover Tooltip */}
          <span className="absolute right-16 px-3 py-1.5 rounded-xl bg-forest-900 text-cream-100 text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-md pointer-events-none">
            {language === "bn" ? "প্রকৃতি বিশেষজ্ঞের সাথে কথা বলুন 🌱" : "Chat with Nature Expert 🌱"}
          </span>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[400px] h-[550px] max-h-[85vh] bg-[#fdfbf7] rounded-3xl shadow-2xl border border-forest-200/90 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-forest-800 via-forest-700 to-forest-800 text-white p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-forest-600/80 border border-forest-400/40 flex items-center justify-center text-mint-200 shadow-sm">
                <Sprout className="w-6 h-6 text-mint-300" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-tight flex items-center gap-1.5">
                  <span>{t.ai.chatTitle}</span>
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
                </h3>
                <p className="text-[11px] text-forest-200">
                  {t.ai.onlineStatus}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-forest-200 hover:text-white rounded-lg hover:bg-forest-600/50 transition-colors"
                aria-label="Minimize Chat"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#fbf9f4]/60">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full bg-forest-100 border border-forest-200 text-forest-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="w-4 h-4 text-forest-700" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-soft-sm ${
                    msg.role === "user"
                      ? "bg-forest-700 text-white rounded-tr-none"
                      : "bg-white text-forest-950 border border-forest-100 rounded-tl-none"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <div
                    className={`text-[10px] mt-1 text-right ${
                      msg.role === "user" ? "text-forest-200" : "text-stone-400"
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>

                {msg.role === "user" && (
                  <div className="w-7 h-7 rounded-full bg-earth-200 border border-earth-300 text-earth-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="w-4 h-4 text-earth-800" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing Loader */}
            {isLoading && (
              <div className="flex gap-2.5 items-center text-xs text-forest-700 bg-white/80 border border-forest-100 rounded-2xl px-4 py-2 w-max">
                <Sparkles className="w-3.5 h-3.5 text-forest-600 animate-spin" />
                <span>{t.ai.thinking}</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Suggestions */}
          {messages.length <= 2 && (
            <div className="px-4 py-2 bg-cream-100/70 border-t border-forest-100 flex gap-1.5 overflow-x-auto no-scrollbar">
              {quickPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(prompt)}
                  className="px-2.5 py-1 text-[11px] rounded-full bg-white hover:bg-forest-50 border border-forest-200 text-forest-800 whitespace-nowrap transition-colors flex-shrink-0"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Footer Input Form */}
          <div className="p-3 bg-white border-t border-forest-100">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t.ai.placeholder}
                disabled={isLoading}
                className="flex-1 bg-cream-50 border border-forest-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-forest-900 placeholder-forest-400 focus:outline-none focus:ring-2 focus:ring-forest-500 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2.5 rounded-xl bg-forest-700 hover:bg-forest-800 disabled:bg-stone-300 text-white transition-colors flex-shrink-0 shadow-sm"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <p className="text-[10px] text-center text-stone-400 mt-1.5 line-clamp-1">
              {t.ai.disclaimer}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
