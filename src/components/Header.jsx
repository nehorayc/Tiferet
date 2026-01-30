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
        <header className="w-full relative z-10 bg-transparent px-10 pt-6">
            {/* Shul Name - Centered & Decorated */}
            <div className="flex justify-center mb-8">
                <div className="relative inline-block px-14 py-2">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-px bg-gradient-to-r from-transparent to-[#d4af37]"></div>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-px bg-gradient-to-l from-transparent to-[#d4af37]"></div>
                    <h1 className="text-6xl font-black text-[#d4af37] font-serif uppercase tracking-[0.25em] drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] text-center">
                        {shulName}
                    </h1>
                </div>
            </div>

            {/* Weather Widget - Floating Left */}
            <div className="absolute left-10 top-10 flex items-center gap-4 bg-black/50 backdrop-blur-md border border-[#d4af37]/30 px-6 py-3 rounded-full shadow-2xl">
                <CloudSun className="text-[#d4af37]" size={32} />
                <span className="text-3xl font-bold text-white leading-none">
                    {weather ? `${weather.temp}°` : '--°'}
                </span>
            </div>

            {/* Single Horizontal Row of Split Bubbles */}
            <div className="flex items-center justify-center gap-6 px-10 py-6 mb-4 flex-wrap">

                {/* 1. Hebrew Date Bubble */}
                <div className="frame-parasha px-8 py-4 flex items-center justify-center min-w-[300px] h-[100px]">
                    <div className="text-4xl font-black text-white font-serif tracking-widest drop-shadow-lg text-center whitespace-nowrap">
                        {hebrewDate?.hebrew || 'טוען...'}
                    </div>
                </div>

                {/* 2. Parasha Bubble (Focal Point) */}
                {shabbatInfo?.parsha && (
                    <div className="frame-parasha px-10 py-4 flex items-center justify-center gap-4 min-w-[420px] h-[120px] bg-[#d4af37]/20 border-[#d4af37]/60 shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                        <BookOpen size={42} className="text-[#d4af37] shrink-0" />
                        <span className="text-5xl font-black text-white drop-shadow-xl font-serif tracking-[0.1em] leading-none text-center whitespace-nowrap">
                            {shabbatInfo.parsha}
                        </span>
                    </div>
                )}

                {/* 3. Digital Clock Bubble */}
                <div className="frame-parasha px-8 py-4 flex flex-col items-center justify-center min-w-[300px] h-[100px]">
                    <div className="text-5xl font-black font-mono text-white tracking-[0.15em] drop-shadow-lg">
                        {formatTime(time)}
                    </div>
                    <div className="text-[10px] text-[#d4af37] font-serif font-bold uppercase tracking-[0.2em] mt-1 opacity-90 whitespace-nowrap">
                        {formatDate(time)}
                    </div>
                </div>

                {/* Vertical Separator */}
                <div className="w-px h-20 bg-[#d4af37]/30 mx-4"></div>

                {/* 4. Candle Lighting */}
                <div className="frame-time px-8 py-3 flex items-center justify-between min-w-[280px] h-[90px]">
                    <div className="flex flex-col items-start gap-1">
                        <Flame size={24} className="text-orange-400" />
                        <span className="text-xl text-white/80 font-serif font-bold whitespace-nowrap">כניסת שבת</span>
                    </div>
                    <span className="text-4xl font-bold text-white font-mono tracking-widest">{shabbatInfo?.candles || '--:--'}</span>
                </div>

                {/* 5. Havdalah */}
                <div className="frame-time px-8 py-3 flex items-center justify-between min-w-[280px] h-[90px]">
                    <div className="flex flex-col items-start gap-1">
                        <Star size={24} className="text-blue-400" />
                        <span className="text-xl text-white/80 font-serif font-bold whitespace-nowrap">צאת שבת</span>
                    </div>
                    <span className="text-4xl font-bold text-white font-mono tracking-widest">{shabbatInfo?.havdalah || '--:--'}</span>
                </div>

                {/* 6. Rabenu Tam */}
                <div className="frame-time px-8 py-3 flex items-center justify-between min-w-[280px] h-[90px]">
                    <span className="text-xl text-[#d4af37] font-serif font-bold whitespace-nowrap">צאת ר"ת</span>
                    <span className="text-4xl font-bold text-[#d4af37] font-mono tracking-widest">{shabbatInfo?.rabenuTam || '--:--'}</span>
                </div>
            </div>
        </header>
    );
};
