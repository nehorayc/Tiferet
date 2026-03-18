import React, { useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { Carousel } from './components/Carousel';
import { Header } from './components/Header';
import { Ticker } from './components/Ticker';
import { AzkarotSidebar } from './components/AzkarotSidebar';
import bgImage from './assets/bg_synagogue.png';

export function MobileApp({ data, zmanim, hebrewDate, shabbatInfo, sheetLoading }) {
    const slideDuration = useMemo(() => {
        return parseInt(data.settings?.SlideDuration) || 15;
    }, [data.settings?.SlideDuration]);

    const shulName = data.settings?.ShulName || 'תפארת ישראל';

    return (
        <div
            className="flex flex-col min-h-screen text-white bg-slate-900"
            style={{
                direction: 'rtl',
                backgroundImage: `url(${bgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
            }}
        >
            <div className="sticky top-0 z-50 shadow-md">
                <Header shulName={shulName} shabbatInfo={shabbatInfo} hebrewDate={hebrewDate} />
            </div>

            <main className="flex-1 flex flex-col gap-4 p-4">
                {/* Messages Carousel */}
                <section className="bg-slate-800/80 rounded-2xl p-4 shadow-lg backdrop-blur-sm border border-slate-700">
                    <h2 className="text-xl font-bold mb-2 text-center text-blue-300">הודעות</h2>
                    <div className="h-64">
                        <Carousel messages={data.messages} duration={slideDuration} />
                    </div>
                </section>

                {/* Zmanim */}
                <section className="bg-slate-800/80 rounded-2xl overflow-hidden shadow-lg backdrop-blur-sm border border-slate-700">
                    <Sidebar zmanimSheet={data.zmanimSheet} loading={sheetLoading} />
                </section>

                {/* Azkarot */}
                <section className="bg-slate-800/80 rounded-2xl overflow-hidden shadow-lg backdrop-blur-sm border border-slate-700">
                    <AzkarotSidebar azkarot={data.azkarot} hebrewDate={hebrewDate} loading={sheetLoading} />
                </section>
            </main>

            <div className="sticky bottom-0 z-50 mt-auto">
                <Ticker messages={data.messages} zmanim={zmanim} />
            </div>
        </div>
    );
}
