import React, { useMemo, useEffect } from 'react';
import { useGoogleSheets } from './hooks/useGoogleSheets';
import { useHebcal } from './hooks/useHebcal'; // Import hook here
import { Sidebar } from './components/Sidebar';
import { Carousel } from './components/Carousel';
import { Header } from './components/Header'; // New Header
import { Loader2 } from 'lucide-react';

import bgImage from './assets/bg_synagogue.png';


import { AzkarotSidebar } from './components/AzkarotSidebar';

function App() {
  const { data, loading: sheetLoading, error } = useGoogleSheets();
  const { zmanim, hebrewDate, shabbatInfo, loading: hebcalLoading } = useHebcal(); // Execute hook

  // --- SCHEDULED AUTO-RELOAD (Sun & Wed Midnight) ---
  React.useEffect(() => {
    const getNextMidnight = (dayOfWeek) => {
      const now = new Date();
      const result = new Date(now);
      result.setDate(now.getDate() + (dayOfWeek + 7 - now.getDay()) % 7);
      result.setHours(0, 0, 0, 0); // 00:00:00

      // If the resulting time is in the past (e.g. today is the day but 00:00 passed), add 7 days
      if (result <= now) {
        result.setDate(result.getDate() + 7);
      }
      return result;
    };

    const nextSunday = getNextMidnight(0); // 0 = Sunday
    const nextWednesday = getNextMidnight(3); // 3 = Wednesday

    // Choose the soonest one
    const nextReload = nextSunday < nextWednesday ? nextSunday : nextWednesday;
    const timeToReload = nextReload.getTime() - new Date().getTime();

    console.log(`System scheduled to reload at: ${nextReload.toLocaleString()} (in ${Math.round(timeToReload / 1000 / 3600)} hours)`);

    const timer = setTimeout(() => {
      window.location.reload();
    }, timeToReload);

    return () => clearTimeout(timer);
  }, []);
  // --------------------------------------------------

  const slideDuration = useMemo(() => {
    return parseInt(data.settings?.SlideDuration) || 15;
  }, [data.settings?.SlideDuration]);

  const shulName = data.settings?.ShulName || 'תפארת ישראל';

  useEffect(() => {
    document.title = `בית כנסת ${shulName} - לוח דיגיטלי`;
  }, [shulName]);

  // Combine loading states slightly or just show sheet loading which is critical
  if (sheetLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-900 text-white gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
        <div className="text-2xl font-bold animate-pulse">מתחבר למסד הנתונים...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-900 text-red-400 p-10 text-center">
        <div className="text-5xl font-bold mb-4">שגיאת חיבור</div>
        <div className="text-2xl mb-8">לא ניתן לטעון את הנתונים מ-Google Sheets.</div>
        <div className="p-4 bg-slate-800 rounded border border-slate-700 font-mono text-sm max-w-2xl">
          {error.message}
        </div>
        <div className="mt-8 text-slate-500">וודא שהגליון פורסם לאינטרנט כ-CSV.</div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        direction: 'rtl',
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <Header shulName={shulName} shabbatInfo={shabbatInfo} hebrewDate={hebrewDate} />

      {/* Main Body Area: Flex Row [Azkarot(R) | Carousel(C) | Zmanim(L)] */}
      <div className="flex flex-1 overflow-hidden relative" style={{ backgroundColor: 'transparent' }}>
        {/* 1. Right Sidebar (Azkarot) - FIXED WIDTH for 1080p readability */}
        <div className="w-[420px] flex-shrink-0">
          <AzkarotSidebar azkarot={data.azkarot} hebrewDate={hebrewDate} loading={sheetLoading} />
        </div>

        {/* 2. Main Carousel (Center) - Expanded */}
        <main className="flex-1 flex items-center justify-center relative px-8 py-4">
          <Carousel messages={data.messages} duration={slideDuration} />
        </main>

        {/* 3. Left Sidebar (Zmanim) - FIXED WIDTH for 1080p readability */}
        <div className="w-[450px] flex-shrink-0">
          <Sidebar zmanimSheet={data.zmanimSheet} loading={sheetLoading} />
        </div>
      </div>
    </div>
  );
}

export default App;
