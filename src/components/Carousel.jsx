import React, { useState, useEffect } from 'react';
import { SlideCard } from './SlideCard';

export const Carousel = ({ messages, duration = 15 }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (messages.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % messages.length);
        }, duration * 1000);

        return () => clearInterval(interval);
    }, [messages.length, duration]);

    if (!messages || messages.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 text-4xl p-12 text-center">
                <div className="mb-4">אין הודעות לתצוגה כרגע.</div>
                <div className="text-2xl opacity-50 italic">מעדכן נתונים באופן אוטומטי...</div>
            </div>
        );
    }

    const currentMessage = messages[currentIndex];

    return (
        <div className="w-full h-full relative overflow-hidden bg-transparent">

            <SlideCard key={currentMessage.id} message={currentMessage} />

            {/* Slide Navigator dots */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-6 z-10">
                {messages.map((_, idx) => (
                    <div
                        key={idx}
                        className={`w-6 h-6 rounded-full transition-all duration-500 shadow-lg border border-black/20 ${idx === currentIndex
                                ? 'bg-[#d4af37] scale-125'
                                : 'bg-white/50 hover:bg-white/80'
                            }`}
                        style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
                    />
                ))}
            </div>

            {/* Slide duration progress bar */}
            <div className="absolute bottom-0 right-0 left-0 h-2 bg-slate-800">
                <div
                    key={currentIndex}
                    className="h-full bg-blue-500/50 animate-progress"
                    style={{ animationDuration: `${duration}s` }}
                />
            </div>
        </div>
    );
};
