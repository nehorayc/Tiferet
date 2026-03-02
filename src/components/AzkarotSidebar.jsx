import React, { useEffect, useRef } from 'react';
import { ScrollText, Flame } from 'lucide-react';

export const AzkarotSidebar = ({ azkarot, hebrewDate, loading }) => {
    const scrollContainerRef = useRef(null);

    // Auto-scroll logic for Azkarot (One-direction Loop)
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        let scrollAmount = 0;
        const speed = 1.0; // Increased speed for better readability

        const scrollInterval = setInterval(() => {
            if (container.scrollHeight <= container.clientHeight) return;

            scrollAmount += speed;
            if (scrollAmount >= (container.scrollHeight - container.clientHeight)) {
                scrollAmount = 0;
            }
            container.scrollTop = scrollAmount;
        }, 50);

        return () => clearInterval(scrollInterval);
    }, [azkarot]);

    // Helper to normalize Hebrew strings (removes Nikud, gershayim, etc)
    const normalize = (str) => {
        if (!str) return '';
        // Remove Nikud, gershayim, and simplify common variations
        return str
            .replace(/[\u0591-\u05C7]/g, '') // Remove Nikud
            .replace(/['"׳״]/g, '') // Remove gershayim and quotation marks
            .replace(/אדר א/g, 'אדר1') // Standardize Adar I
            .replace(/אדר ב/g, 'אדר2') // Standardize Adar II
            .replace(/\s+/g, '') // Remove spaces
            .trim();
    };

    const currentMonthNorm = normalize(hebrewDate?.monthName);
    const isAdarRegular = !hebrewDate?.isLeapYear && currentMonthNorm === 'אדר';

    // Filter by current Hebrew month name with smart Adar logic
    const currentMonthAzkarot = azkarot?.filter(item => {
        const itemMonthNorm = normalize(item.month || item.Month || '');

        // Logical check:
        // 1. If it's a regular year (not leap) and we are in Adar:
        //    Match anything that looks like Adar, Adar 1, or Adar 2.
        if (isAdarRegular) {
            return itemMonthNorm === 'אדר' || itemMonthNorm === 'אדר1' || itemMonthNorm === 'אדר2';
        }

        // 2. Otherwise (Leap year or other months): Exact match
        return itemMonthNorm === currentMonthNorm;
    }).sort((a, b) => {
        const dayA = parseInt(a.day || a.Day || 0);
        const dayB = parseInt(b.day || b.Day || 0);
        return dayA - dayB;
    }) || [];

    // Helper to convert number to Hebrew Gematriya day (1-30)
    const toGematriya = (num) => {
        const n = parseInt(num);
        const days = [
            '', "א'", "ב'", "ג'", "ד'", "ה'", "ו'", "ז'", "ח'", "ט'", "י'",
            "י\"א", "י\"ב", "י\"ג", "י\"ד", "ט\"ו", "ט\"ז", "י\"ז", "י\"ח", "י\"ט", "כ'",
            "כ\"א", "כ\"ב", "כ\"ג", "כ\"ד", "כ\"ה", "כ\"ו", "כ\"ז", "כ\"ח", "כ\"ט", "ל'"
        ];
        return days[n] || num;
    };

    return (
        <aside className="w-full h-full flex flex-col overflow-hidden bg-transparent">
            <div className="relative z-10 flex flex-col h-full p-8">

                {/* Header Section */}
                <div className="flex-1 overflow-hidden relative" ref={scrollContainerRef}>
                    <h3 className="text-4xl font-black text-[#d4af37] mb-8 text-center border-b-2 border-[#d4af37]/50 pb-6 flex items-center justify-center gap-4 sticky top-0 z-10 py-4"
                        style={{ backgroundColor: 'rgba(20, 20, 40, 0.98)', borderRadius: '12px', marginBottom: '20px' }}>
                        <ScrollText size={52} />
                        <span>לעילוי נשמת</span>
                    </h3>

                    {loading ? (
                        <div className="text-[#d4af37]/60 animate-pulse text-center font-serif italic text-3xl">טוען נתונים...</div>
                    ) : currentMonthAzkarot.length === 0 ? (
                        <div className="text-white/40 text-center italic text-2xl mt-10">אין אזכרות לחודש זה</div>
                    ) : (
                        <div className="space-y-4 pb-6">
                            {currentMonthAzkarot.map((item, idx) => {
                                const name = item.Name || item.name;
                                const parentName = item['Mother/father_name'] || item.parent_name;
                                const day = item.Day || item.day;
                                const month = item.Month || item.month;
                                const year = item.Death_year || item.death_year;

                                return (
                                    <div key={idx} className="flex flex-col items-center p-5 border-2 border-white/5 hover:border-[#d4af37]/60 transition-all duration-300 shadow-xl text-center"
                                        style={{
                                            backgroundColor: 'rgba(20, 20, 40, 0.95)',
                                            borderRadius: '20px',
                                            marginBottom: '10px'
                                        }}>
                                        {/* Line 1 & 2: Names */}
                                        <div className="flex flex-col items-center mb-2">
                                            <Flame size={24} className="text-[#d4af37] animate-pulse mb-1" />
                                            <h4 className="text-3xl font-black text-white leading-tight">
                                                {name}
                                            </h4>
                                            {parentName && (
                                                <span className="text-xl text-slate-300 font-serif">
                                                    {parentName}
                                                </span>
                                            )}
                                        </div>

                                        {/* Line 3: Date & Year */}
                                        <div className="w-1/2 h-px bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent mb-2"></div>
                                        <div className="text-2xl font-black text-white font-serif flex items-center justify-center gap-3">
                                            <span>{toGematriya(day)} {month}</span>
                                            {year && (
                                                <span className="text-xl text-[#d4af37] font-black tracking-tighter opacity-90">
                                                    {year}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Bottom static text */}
                <div className="mt-6 pt-6 border-t border-[#d4af37]/30 text-center text-[#d4af37] text-xl font-serif italic shrink-0" style={{ textShadow: '2px 2px 4px black' }}>
                    ״זכרון צדיק לברכה״
                </div>
            </div>
        </aside>
    );
};
