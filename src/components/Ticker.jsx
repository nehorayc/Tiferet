import React from 'react';
import { Star } from 'lucide-react';

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

const formatTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
};

export const Ticker = ({ zmanim }) => {
    // Collect valid Zmanim pairs
    let zmanimItems = [];
    if (zmanim) {
        zmanimItems = Object.keys(ZMANIM_LABELS)
            .filter(key => zmanim[key])
            .map(key => ({
                label: ZMANIM_LABELS[key],
                time: formatTime(zmanim[key])
            }));
    }

    // Repeat the list to allow seamless infinite scrolling
    const repeats = Array(6).fill(0); // 6 repetitions of the whole list

    return (
        <div className="w-full h-20 bg-black/70 border-t-2 border-[#d4af37]/40 flex items-center relative z-20 backdrop-blur-lg overflow-hidden">
            {/* The Badge */}
            <div className="h-full bg-[#d4af37] text-black px-8 flex items-center font-bold text-3xl shrink-0 z-30 shadow-[5px_0_15px_rgba(0,0,0,0.5)]">
                זמני היום
            </div>

            <div className="flex-1 h-full flex items-center overflow-hidden relative">
                <div className="ticker-track flex items-center whitespace-nowrap">
                    {RepeatsRender(repeats, zmanimItems)}
                </div>
            </div>
        </div>
    );
};

const RepeatsRender = (repeats, zmanimItems) => {
    if (zmanimItems.length === 0) {
        return repeats.map((_, i) => (
            <span key={i} className="text-4xl font-serif text-white px-2 py-2 font-bold whitespace-nowrap">
                טוען זמנים... •
            </span>
        ));
    }

    return repeats.map((_, repeatIndex) => (
        <React.Fragment key={`repeat-${repeatIndex}`}>
            {zmanimItems.map((item, itemIndex) => (
                <div key={`item-${repeatIndex}-${itemIndex}`} className="flex items-center mx-6">
                    <span className="text-4xl font-serif text-[#d4af37] font-bold tracking-wide">
                        {item.label}
                    </span>
                    <span className="text-4xl font-mono text-white font-black ml-4 mr-3 drop-shadow-md">
                        {item.time}
                    </span>
                    <Star size={18} className="text-[#d4af37]/60 ml-6 mr-2" />
                </div>
            ))}
        </React.Fragment>
    ));
};
