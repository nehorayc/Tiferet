import React, { useMemo } from 'react';
import { useGoogleSheets } from './hooks/useGoogleSheets';
import { useHebcal } from './hooks/useHebcal'; // Import hook here
import { Sidebar } from './components/Sidebar';
import { Carousel } from './components/Carousel';
import { Header } from './components/Header'; // New Header
import { Loader2 } from 'lucide-react';

import bgImage from './assets/bg_synagogue.png';


import { AzkarotSidebar } from './components/AzkarotSidebar';
import { Ticker } from './components/Ticker';

function App() {
  const { data, loading: sheetLoading, error } = useGoogleSheets();
  const { zmanim, hebrewDate, shabbatInfo, loading: hebcalLoading } = useHebcal(); // Execute hook

  const slideDuration = useMemo(() => {
    return parseInt(data.settings?.SlideDuration) || 15;
  }, [data.settings?.SlideDuration]);

  const shulName = data.settings?.ShulName || 'תפארת ישראל';

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
        backgroundSize: '100% 100%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <Header shulName={shulName} shabbatInfo={shabbatInfo} hebrewDate={hebrewDate} />

      {/* Main Body Area: Flex Row [Azkarot(R) | Carousel(C) | Zmanim(L)] */}
      <div className="flex flex-1 overflow-hidden relative" style={{ backgroundColor: 'transparent' }}>
        {/* 1. Azkarot Sidebar (Right) */}
        <AzkarotSidebar azkarot={data.azkarot} hebrewDate={hebrewDate} loading={sheetLoading} />

        {/* 2. Main Carousel (Center) - Expanded */}
        <main className="flex-[2] flex items-center justify-center relative p-4">
          <Carousel messages={data.messages} duration={slideDuration} />
        </main>

        {/* 3. Zmanim Sidebar (Left) */}
        <Sidebar zmanim={zmanim} hebrewDate={hebrewDate} loading={hebcalLoading} />
      </div>

      {/* 4. Scrolling News Ticker (Bottom) */}
      <Ticker messages={data.messages} />
    </div>
  );
}

export default App;
