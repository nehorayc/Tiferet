import React, { useEffect, useRef } from 'react';
import { ScrollText, Flame } from 'lucide-react';

export const AzkarotSidebar = ({ azkarot, hebrewDate, loading }) => {
    const scrollContainerRef = useRef(null);

    // Auto-scroll logic for Azkarot (One-direction Loop)
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        let scrollAmount = 0;
        const speed = 0.4; // Slightly slower than Zmanim for readability

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
        <aside style={{ width: '25%', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: 'transparent' }}>
            <div className="relative z-10 flex flex-col h-full p-8">

                {/* Header Section */}
                <div className="flex-1 overflow-hidden relative" ref={scrollContainerRef}>
                    <h3 className="text-3xl font-bold text-[#d4af37] mb-6 text-center border-b border-[#d4af37]/50 pb-4 flex items-center justify-center gap-3 sticky top-0 z-10 py-2"
                        style={{ backgroundColor: 'rgba(20, 20, 40, 0.95)', borderRadius: '8px', marginBottom: '16px' }}>
                        <ScrollText size={32} />
                        <span>נזכור וננציח - {hebrewDate?.monthName}</span>
                    </h3>

                    {loading ? (
                        <div className="text-[#d4af37]/60 animate-pulse text-center font-serif italic text-2xl">טוען נתונים...</div>
                    ) : currentMonthAzkarot.length === 0 ? (
                        <div className="text-white/40 text-center italic text-xl mt-10">אין אזכרות רשומות לחודש זה</div>
                    ) : (
                        <div className="space-y-3 pb-4">
                            {currentMonthAzkarot.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center p-5 border border-white/5 hover:border-[#d4af37]/60 transition-all duration-300"
                                    style={{
                                        backgroundColor: 'rgba(20, 20, 40, 0.9)',
                                        borderRadius: '8px',
                                        marginBottom: '6px'
                                    }}>
                                    <div className="flex flex-col items-start gap-1">
                                        <span className="text-2xl text-white font-serif font-bold leading-tight">{item.name || item.Name}</span>
                                        <span className="text-lg text-[#d4af37] font-serif italic">לעילוי נשמת</span>
                                    </div>
                                    <div className="flex flex-col items-end min-w-[120px]">
                                        <div className="text-3xl font-bold text-white font-serif border-b border-[#d4af37]/30 pb-1 mb-1">
                                            {toGematriya(item.day || item.Day)} {item.month || item.Month}
                                        </div>
                                        <span className="text-xs text-white/40 font-serif uppercase tracking-widest">תאריך פטירה</span>
                                    </div>
                                </div>
                            ))}
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
