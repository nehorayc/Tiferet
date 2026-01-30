import React from 'react';

export const Ticker = ({ messages = [] }) => {
    // Combine all messages into one long string
    const tickerText = messages.length > 0
        ? messages.map(m => m.body || m.Body).join(' • ')
        : 'ברוכים הבאים לבית הכנסת • שבת שלום ומבורך • תפילת שחרית ב-08:00 • שיעור דף היומי לאחר התפילה';

    return (
        <div className="w-full h-20 bg-black/70 border-t-2 border-[#d4af37]/40 flex items-center relative z-20 backdrop-blur-lg">
            {/* The Badge */}
            <div className="h-full bg-[#d4af37] text-black px-8 flex items-center font-bold text-3xl shrink-0 z-30 shadow-[5px_0_15px_rgba(0,0,0,0.5)]">
                הודעות ועדכונים
            </div>

            <div className="ticker-wrap flex-1 h-full flex items-center">
                <div className="ticker-item">
                    <span className="text-4xl font-serif text-white px-8 py-2 font-bold whitespace-nowrap">
                        {tickerText} • {tickerText}
                    </span>
                </div>
            </div>
        </div>
    );
};
