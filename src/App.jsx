import React, { useMemo } from 'react';
import { useGoogleSheets } from './hooks/useGoogleSheets';
import { useHebcal } from './hooks/useHebcal'; // Import hook here
import { Sidebar } from './components/Sidebar';
import { Carousel } from './components/Carousel';
import { Header } from './components/Header'; // New Header
import { Loader2 } from 'lucide-react';

import bgImage from './assets/royal_bg_v3.png';


function App() {
  const { data, loading: sheetLoading, error } = useGoogleSheets();
  const { zmanim, hebrewDate, shabbatInfo, loading: hebcalLoading } = useHebcal(); // Execute hook

  const slideDuration = useMemo(() => {
    return parseInt(data.settings?.SlideDuration) || 15;
  }, [data.settings?.SlideDuration]);

  const shulName = data.settings?.ShulName || 'בית כנסת';

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
        flexDirection: 'column', // Vertical layout first (Header -> Content)
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        direction: 'rtl',
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#0f172a'
      }}

    >

      {/* Top Header Bar (Full Width) */}
      <Header shulName={shulName} shabbatInfo={shabbatInfo} />

      {/* Main Body Area: Flex Row [Sidebar | Content] */}
      <div className="flex flex-1 overflow-hidden relative">

        {/* Main Content (Carousel) on Right (RTL: First child is Right) */}
        {/* Wait, in RTL Flex Row: First child is Right side. Content should be on Right. Sidebar on Left. */}
        {/* Wait, user said "Right side with messages is still blue". So Content is Right. */}
        {/* App.jsx usually had main then sidebar. */}
        {/* <main> was 1st child. <aside> was 2nd child. */}
        {/* In RTL: 1st child is Right. 2nd child is Left. */}
        {/* So Main is Right, Side is Left. */}

        <main style={{ flex: 1, position: 'relative' }}>
          <Carousel messages={data.messages} duration={slideDuration} />
        </main>

        <Sidebar zmanim={zmanim} hebrewDate={hebrewDate} loading={hebcalLoading} />

      </div>

    </div>
  );
}

export default App;
