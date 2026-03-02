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

            <SlideCard key={currentIndex} message={currentMessage} />
        </div>
    );
};
