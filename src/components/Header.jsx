import React from 'react';
import { BookOpen, Flame, Star } from 'lucide-react';

export const Header = ({ shulName, shabbatInfo }) => {
    return (
        <header className="w-full flex flex-col items-center justify-center py-4 px-10 relative z-10 bg-slate-900/60 backdrop-blur-md border-b-4 border-[#d4af37] shadow-xl">

            {/* Row 1: Parsha Name (and Shul Name small in corner if needed) */}
            <div className="flex items-center justify-center w-full mb-2 relative">

                <div className="absolute right-0 top-0 flex flex-col items-start hidden xl:flex">
                    <h1 className="text-2xl font-bold text-slate-400 font-serif">{shulName}</h1>
                </div>

                {shabbatInfo?.parsha && (
                    <div className="flex items-center justify-center gap-4">
                        <BookOpen size={32} className="text-[#d4af37]" />
                        <span className="text-6xl font-black text-white drop-shadow-lg font-serif tracking-wide">
                            {shabbatInfo.parsha}
                        </span>
                        {shabbatInfo.holidays && (
                            <span className="text-purple-300 text-2xl font-bold bg-purple-900/50 px-4 py-1 rounded-full border border-purple-500/30">
                                {shabbatInfo.holidays}
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Row 2: Times (Beneath) */}
            <div className="flex items-center justify-center gap-16 w-full mt-2">
                {/* Candles */}
                <div className="flex items-center gap-3 bg-slate-800/50 px-6 py-2 rounded-xl border border-white/10">
                    <span className="text-slate-300 text-xl flex items-center gap-2">
                        <Flame size={20} className="text-orange-400" />
                        כניסת שבת:
                    </span>
                    <span className="text-4xl font-bold text-white font-mono tracking-widest">
                        {shabbatInfo?.candles || '--:--'}
                    </span>
                </div>

                {/* Havdalah */}
                <div className="flex items-center gap-3 bg-slate-800/50 px-6 py-2 rounded-xl border border-white/10">
                    <span className="text-slate-300 text-xl flex items-center gap-2">
                        <Star size={20} className="text-blue-400" />
                        צאת שבת:
                    </span>
                    <span className="text-4xl font-bold text-white font-mono tracking-widest">
                        {shabbatInfo?.havdalah || '--:--'}
                    </span>
                </div>

                {/* Rabenu Tam */}
                <div className="flex items-center gap-3 bg-[#d4af37]/10 px-6 py-2 rounded-xl border border-[#d4af37]/30">
                    <span className="text-[#d4af37] text-xl font-bold">
                        רבינו תם:
                    </span>
                    <span className="text-4xl font-bold text-[#d4af37] font-mono tracking-widest">
                        {shabbatInfo?.rabenuTam || '--:--'}
                    </span>
                </div>
            </div>
        </header>
    );
};
