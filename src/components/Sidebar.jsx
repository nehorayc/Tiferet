import React, { useState, useEffect } from 'react';
import { useHebcal } from '../hooks/useHebcal';
import { Sun, Moon, Sunrise, Sunset, Clock, BookOpen, Flame } from 'lucide-react';

const ZMANIM_LABELS = {
    alotHaShachar: 'עלות השחר',
    misheyakir: 'משיכיר',
    sunrise: 'הנץ החמה',
    sofZmanShma: 'סוף זמן שמע',
    sofZmanTfilla: 'סוף זמן תפילה',
    chatzot: 'חצות היום',
    minchaGedola: 'מנחה גדולה',
    minchaKetana: 'מנחה קטנה',
    plagHaMincha: 'פלג המנחה',
    sunset: 'שקיעה',
    tzeitHaKochavim: 'צאת הכוכבים'
};

export const Sidebar = ({ zmanimSheet, loading }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const ITEMS_PER_PAGE = 4;
    const ROTATION_INTERVAL = 5000; // 5 seconds

    // Pagination Logic
    useEffect(() => {
        if (!zmanimSheet || zmanimSheet.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => {
                const nextIndex = prevIndex + ITEMS_PER_PAGE;
                return nextIndex >= zmanimSheet.length ? 0 : nextIndex;
            });
        }, ROTATION_INTERVAL);

        return () => clearInterval(interval);
    }, [zmanimSheet]);

    // Get current visible items
    const visibleItems = zmanimSheet?.slice(currentIndex, currentIndex + ITEMS_PER_PAGE) || [];

    return (
        <aside className="w-full h-full flex flex-col overflow-hidden bg-transparent">
            <div className="relative z-10 flex flex-col h-full p-8">

                {/* Zmanim List Container */}
                <div className="flex-1 flex flex-col relative">
                    <h3 className="text-4xl font-black text-[#d4af37] mb-6 text-center border-b-2 border-[#d4af37]/50 pb-4 flex items-center justify-center gap-3 bg-[rgba(20,20,40,0.98)] rounded-xl py-3 shadow-lg shrink-0">
                        <Clock size={40} />
                        <span>זמני תפילות</span>
                    </h3>

                    {loading && (!zmanimSheet || zmanimSheet.length === 0) ? (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-[#d4af37]/60 animate-pulse text-center font-serif italic text-3xl">טוען זמנים...</div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col gap-4">
                            {visibleItems.map((item, idx) => {
                                const name = item.Name || item.name;
                                const time = item.Time || item.time;
                                if (!name) return null;

                                return (
                                    <div key={`${currentIndex}-${idx}`}
                                        className="flex-1 flex justify-between items-center px-8 border-2 border-white/5 hover:border-[#d4af37]/60 transition-all duration-500 shadow-2xl animate-in fade-in slide-in-from-bottom-4"
                                        style={{
                                            backgroundColor: 'rgba(20, 20, 40, 0.95)',
                                            borderRadius: '16px',
                                        }}
                                    >
                                        <div className="flex items-center gap-4">
                                            <span className="text-4xl text-slate-100 font-bold drop-shadow-md tracking-wide">{name}</span>
                                        </div>
                                        <span className="text-5xl font-black text-white font-mono drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] tracking-tight">
                                            {time}
                                        </span>
                                    </div>
                                );
                            })}

                            {/* Fill empty space if less than 4 items on last page */}
                            {Array.from({ length: Math.max(0, ITEMS_PER_PAGE - visibleItems.length) }).map((_, i) => (
                                <div key={`empty-${i}`} className="flex-1" />
                            ))}
                        </div>
                    )}
                </div>

                <div className="mt-6 pt-6 border-t border-[#d4af37]/30 text-center text-[#d4af37] text-xl font-serif italic shrink-0" style={{ textShadow: '2px 2px 4px black' }}>
                    ״כי מציון תצא תורה״
                </div>
            </div>
        </aside>
    );
};
