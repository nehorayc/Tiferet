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

const ZMAN_ICONS = {
    sunrise: Sunrise,
    sunset: Sunset,
    alotHaShachar: Sun,
    tzeitHaKochavim: Moon,
};

export const Sidebar = ({ zmanim, hebrewDate, loading }) => {
    const scrollContainerRef = React.useRef(null);

    // Auto-scroll logic for Zmanim (One-direction Loop)
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        let scrollAmount = 0;
        const speed = 0.5; // Pixels per tick

        const scrollInterval = setInterval(() => {
            // If content fits, no need to scroll
            if (container.scrollHeight <= container.clientHeight) return;

            scrollAmount += speed;

            // If reached the bottom, reset to top
            if (scrollAmount >= (container.scrollHeight - container.clientHeight)) {
                scrollAmount = 0;
            }

            container.scrollTop = scrollAmount;
        }, 50);

        return () => clearInterval(scrollInterval);
    }, [zmanim]);

    const parseHebcalTime = (timeStr) => {
        if (!timeStr) return '';
        const date = new Date(timeStr);
        return date.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <aside style={{ width: '30%', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: 'transparent' }}>
            <div className="relative z-10 flex flex-col h-full p-8">

                {/* Zmanim List */}
                <div className="flex-1 overflow-hidden relative" ref={scrollContainerRef}>
                    <h3 className="text-3xl font-bold text-[#d4af37] mb-6 text-center border-b border-[#d4af37]/50 pb-4 flex items-center justify-center gap-3 sticky top-0 z-10 py-2"
                        // Add a slight background to the header so it stands out over scrolling cards if needed, or keep transparent. 
                        // User requested floating cards, header can be one too or separate. Let's make header separate but clear.
                        style={{ backgroundColor: 'rgba(20, 20, 40, 0.95)', borderRadius: '8px', marginBottom: '16px' }}
                    >
                        <Clock size={32} />
                        <span>זמני היום</span>
                    </h3>

                    {loading && !hebrewDate?.hebrew ? (
                        <div className="text-[#d4af37]/60 animate-pulse text-center font-serif italic text-2xl">טוען זמנים...</div>
                    ) : (
                        <div className="space-y-2 pb-4">
                            {Object.entries(ZMANIM_LABELS).map(([key, label]) => {
                                if (!zmanim?.[key]) return null;
                                const Icon = ZMAN_ICONS[key] || null;

                                return (
                                    <div key={key} className="flex justify-between items-center p-5 border border-white/5 hover:border-[#d4af37]/60 transition-all duration-300"
                                        style={{
                                            backgroundColor: 'rgba(20, 20, 40, 0.9)',
                                            borderRadius: '8px',
                                            marginBottom: '6px'
                                        }}
                                    >
                                        <div className="flex items-center gap-4">
                                            {Icon && <Icon size={28} className="text-[#d4af37]" />}
                                            <span className="text-2xl text-slate-100 font-serif font-normal">{label}</span>
                                        </div>
                                        <span className="text-4xl font-bold text-white font-mono drop-shadow-md">
                                            {parseHebcalTime(zmanim[key])}
                                        </span>
                                    </div>
                                );
                            })}
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
