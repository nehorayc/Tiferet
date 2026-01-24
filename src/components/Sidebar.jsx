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
    const [time, setTime] = useState(new Date());
    const scrollContainerRef = React.useRef(null);

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);


    // Auto-scroll logic for Zmanim
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        let scrollAmount = 0;
        let direction = 1;
        const speed = 0.5; // Pixels per tick

        const scrollInterval = setInterval(() => {
            if (container.scrollHeight <= container.clientHeight) return;

            scrollAmount += speed * direction;
            container.scrollTop = scrollAmount;

            if (scrollAmount >= (container.scrollHeight - container.clientHeight)) {
                direction = -1;
            } else if (scrollAmount <= 0) {
                direction = 1;
            }
        }, 50);

        return () => clearInterval(scrollInterval);
    }, [zmanim]);

    const formatTime = (date) => {
        return date.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    };

    const parseHebcalTime = (timeStr) => {
        if (!timeStr) return '';
        const date = new Date(timeStr);
        return date.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <aside style={{ width: '25%', height: '100%', backgroundColor: 'rgba(5, 10, 20, 0.65)', borderLeft: '3px double #d4af37', display: 'flex', flexDirection: 'column', padding: '1.5rem', overflow: 'hidden', backdropFilter: 'blur(12px)', boxShadow: '-5px 0 30px rgba(0,0,0,0.8)' }}>

            {/* Clock Section */}
            <div className="text-center mb-6 border-b-2 border-slate-600/50 pb-6 shrink-0">
                <div className="text-7xl font-bold font-serif tracking-widest text-[#d4af37] drop-shadow-md mb-2" style={{ fontFamily: '"Frank Ruhl Libre", serif' }}>
                    {formatTime(time)}
                </div>
                <div className="text-2xl text-slate-300 font-light">
                    {formatDate(time)}
                </div>
                <div className="text-3xl font-bold text-white mt-3 bg-blue-900/50 py-2 rounded-lg border border-blue-800 shadow-md">
                    {hebrewDate?.hebrew || 'טוען תאריך עברי...'}
                </div>
            </div>

            {/* Zmanim List */}

            <div className="flex-1 overflow-hidden relative" ref={scrollContainerRef}>
                <h3 className="text-2xl font-bold text-[#d4af37] mb-4 text-center border-b border-[#d4af37] pb-2 flex items-center justify-center gap-2 sticky top-0 bg-[#0a0f1e]/95 z-10 py-2">
                    <Clock size={24} />
                    <span>זמני היום</span>
                </h3>

                {loading && !hebrewDate?.hebrew ? (
                    <div className="text-slate-500 animate-pulse text-center">טוען זמנים...</div>
                ) : (
                    <div className="space-y-3 pb-4">
                        {Object.entries(ZMANIM_LABELS).map(([key, label]) => {
                            if (!zmanim?.[key]) return null;
                            const Icon = ZMAN_ICONS[key] || null;

                            return (
                                <div key={key} className="flex justify-between items-center bg-slate-800/60 p-3 rounded border border-slate-700 hover:border-[#d4af37] transition-colors">
                                    <div className="flex items-center gap-3">
                                        {Icon && <Icon size={20} className="text-[#d4af37]" />}
                                        <span className="text-xl text-slate-200">{label}</span>
                                    </div>
                                    <span className="text-2xl font-bold text-white font-mono">
                                        {parseHebcalTime(zmanim[key])}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-700 text-center text-[#d4af37]/60 text-sm font-serif italic shrink-0" style={{ textShadow: '1px 1px 0px black' }}>
                ״כי מציון תצא תורה״
            </div>
        </aside>
    );
};
