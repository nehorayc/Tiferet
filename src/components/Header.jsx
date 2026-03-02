import React, { useState, useEffect } from 'react';
import { BookOpen, Flame, Star, CloudSun } from 'lucide-react';
import { useWeather } from '../hooks/useWeather';

export const Header = ({ shulName, shabbatInfo, hebrewDate }) => {
    const [time, setTime] = useState(new Date());
    const weather = useWeather();

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (date) => {
        return date.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('he-IL', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    return (
        <header className="w-full relative z-10 bg-transparent px-4">
            {/* Shul Name - Centered & Decorated - GIGANTIC FONT */}
            <div className="flex justify-center pt-8 mb-6">
                <div className="relative inline-block px-32 py-4">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-[#d4af37]"></div>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-24 h-1 bg-gradient-to-l from-transparent via-[#d4af37] to-[#d4af37]"></div>
                    <h1 className="text-[12rem] font-black text-[#d4af37] font-serif uppercase tracking-[0.1em] drop-shadow-[0_8px_8px_rgba(0,0,0,1)] text-center leading-none">
                        {shulName}
                    </h1>
                </div>
            </div>

            {/* Weather Widget - Corner Positioning */}
            <div className="absolute left-6 top-4 flex items-center gap-2 bg-black/40 backdrop-blur-md border border-[#d4af37]/30 px-4 py-1.5 rounded-full shadow-xl">
                <CloudSun className="text-[#d4af37]" size={24} />
                <span className="text-xl font-bold text-white leading-none">
                    {weather ? `${weather.temp}°` : '--°'}
                </span>
            </div>

            {/* Header Widgets Container - Fixed Flex Layout */}
            <div className="flex flex-nowrap justify-center gap-4 pb-4 mt-2 px-4 overflow-hidden">
                {/* RIGHT GROUP: Shabbat Times (RTL: First in DOM is Right) */}

                {/* 1. Candles Bubble */}
                <div className="bg-black/70 backdrop-blur-md border border-[#d4af37]/40 rounded-3xl px-6 py-3 shadow-2xl flex items-center gap-3">
                    <Flame size={32} className="text-orange-400" />
                    <div className="flex flex-col items-start leading-none">
                        <span className="text-sm text-[#d4af37] font-black uppercase mb-0.5 tracking-wide">כניסת שבת</span>
                        <span className="text-4xl font-black text-white font-mono tracking-tighter drop-shadow-[0_4px_8px_rgba(0,0,0,1)]">{shabbatInfo?.candles || '--:--'}</span>
                    </div>
                </div>

                {/* 2. Havdalah Bubble */}
                <div className="bg-black/70 backdrop-blur-md border border-[#d4af37]/40 rounded-3xl px-6 py-3 shadow-2xl flex items-center gap-3">
                    <Star size={32} className="text-blue-400" />
                    <div className="flex flex-col items-start leading-none">
                        <span className="text-sm text-[#d4af37] font-black uppercase mb-0.5 tracking-wide">צאת שבת</span>
                        <span className="text-4xl font-black text-white font-mono tracking-tighter drop-shadow-[0_4px_8px_rgba(0,0,0,1)]">{shabbatInfo?.havdalah || '--:--'}</span>
                    </div>
                </div>

                {/* 3. Rabenu Tam Bubble */}
                <div className="bg-black/70 backdrop-blur-md border border-[#d4af37]/40 rounded-3xl px-6 py-3 shadow-2xl flex items-center mx-2">
                    <div className="flex flex-col items-start leading-none px-2">
                        <span className="text-sm text-[#d4af37] font-black uppercase mb-0.5 tracking-wide">צאת ר"ת</span>
                        <span className="text-4xl font-black text-[#d4af37] font-mono tracking-tighter drop-shadow-[0_4px_8px_rgba(0,0,0,1)]">{shabbatInfo?.rabenuTam || '--:--'}</span>
                    </div>
                </div>


                {/* CENTER GROUP: Clock */}

                {/* 4. Digital Clock Bubble */}
                <div className="bg-black/60 backdrop-blur-md border border-[#d4af37]/40 rounded-3xl px-10 py-4 shadow-2xl min-w-[260px] flex flex-col items-center justify-center mx-6">
                    <div className="text-7xl font-black font-mono text-white tracking-[0.05em] leading-none drop-shadow-xl">
                        {formatTime(time)}
                    </div>
                </div>


                {/* LEFT GROUP: Date Info */}

                {/* 5. Hebrew & Gregorian Date Bubble */}
                <div className="bg-black/60 backdrop-blur-md border border-[#d4af37]/40 rounded-2xl px-6 py-3 shadow-2xl flex flex-col items-center justify-center text-center">
                    <div className="text-4xl font-black text-white font-serif tracking-wide whitespace-nowrap leading-tight mb-1">
                        {hebrewDate?.hebrew || 'טוען...'}
                    </div>
                    <div className="text-base text-[#d4af37] font-serif font-bold uppercase tracking-widest opacity-90 whitespace-nowrap">
                        {formatDate(time)}
                    </div>
                </div>

                {/* 6. Parasha Bubble */}
                {shabbatInfo?.parsha && (
                    <div className="bg-black/60 backdrop-blur-md border border-[#d4af37]/40 rounded-2xl px-6 py-3 shadow-2xl flex items-center gap-3 justify-center ml-2">
                        <BookOpen size={28} className="text-[#d4af37]" />
                        <span className="text-3xl font-black text-white font-serif whitespace-nowrap">
                            {shabbatInfo.parsha}
                        </span>
                    </div>
                )}
            </div>
        </header>
    );
};
