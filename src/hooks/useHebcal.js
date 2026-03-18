import { useState, useEffect } from 'react';
import { HDate, Location, Zmanim, HebrewCalendar, Locale } from '@hebcal/core';

// Default to Jerusalem
const JERUSALEM = new Location(31.7683, 35.2137, false, 'Asia/Jerusalem', 'Jerusalem', 'IL', 281184);

export const useHebcal = (shulMethod = 'GRA') => {
    const [zmanim, setZmanim] = useState(null);
    const [hebrewDate, setHebrewDate] = useState(null);
    const [shabbatInfo, setShabbatInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    const calculateData = () => {
        try {
            const now = new Date();
            // HDate(jsDate) uses UTC internally. To avoid the UTC date being "yesterday"
            // (e.g. between midnight and 2am Israel time), pass a Date fixed at local noon.
            // Local noon in UTC+2 = 10:00 UTC — safely the same calendar day.
            const localNoon = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0);
            const hdate = new HDate(localNoon);
            const zman = new Zmanim(JERUSALEM, now);

            // 1. Daily Zmanim
            // Switch calculation methods based on the Google Sheets 'ShulMethod' parameter
            const isMGA = shulMethod === 'MGA';
            const isOHR = shulMethod === 'OHR';

            // OHR typically uses MGA-style day calculations (72 min) for Shacharit / Mincha
            // but a very specific fixed 13.5 minutes (or 5.05 degrees) for Tzeit HaKochavim.
            const useMGABase = isMGA || isOHR;

            const zmanimData = {
                alotHaShachar: useMGABase ? zman.alotHaShachar().toISOString() : zman.alotHaShachar().toISOString(),
                misheyakir: zman.misheyakir().toISOString(),
                sunrise: zman.sunrise().toISOString(),
                sofZmanShma: useMGABase ? zman.sofZmanShmaMGA().toISOString() : zman.sofZmanShma().toISOString(),
                sofZmanTfilla: useMGABase ? zman.sofZmanTfillaMGA().toISOString() : zman.sofZmanTfilla().toISOString(),
                chatzot: zman.chatzot().toISOString(),
                minchaGedola: useMGABase ? zman.minchaGedolaMGA().toISOString() : zman.minchaGedola().toISOString(),
                minchaKetana: useMGABase ? zman.minchaKetanaMGA().toISOString() : zman.minchaKetana().toISOString(),
                plagHaMincha: useMGABase ? zman.plagHaMinchaMGA().toISOString() : zman.plagHaMincha().toISOString(),
                sunset: zman.sunset().toISOString(),
                // Tzeit Logic:
                // MGA: 72 minutes after sunset
                // OHR: ~13.5 minutes after sunset (roughly 5.05 degrees or exactly 13.5 mins)
                // GRA: 8.5 degrees (standard)
                tzeitHaKochavim: isOHR
                    ? new Date(zman.sunset().getTime() + 13.5 * 60000).toISOString()
                    : (isMGA ? zman.tzeit72().toISOString() : zman.tzeit().toISOString())
            };

            // 2. Shabbat & Weekly Info (Parsha, Candles, Havdalah)
            // Look ahead for the next upcoming Shabbat
            const friday = new Date(now);
            friday.setDate(now.getDate() + (5 - now.getDay() + 7) % 7); // Find next Friday

            const saturday = new Date(friday);
            saturday.setDate(friday.getDate() + 1);

            // Get Calendar Events for Friday/Saturday
            const options = {
                start: friday,
                end: saturday,
                location: JERUSALEM,
                candlelighting: true,
                havdalahMins: 40, // Standard Israel
                sedrot: true, // Parsha
                il: true,
                omer: true,
                major: true // Major Holidays
            };
            const events = HebrewCalendar.calendar(options);

            let parshaName = '';
            let candleTime = '';
            let havdalahTime = '';
            let holidays = [];

            events.forEach(e => {
                const desc = e.render('he');
                if (e.getFlags() & 1024) { // Parsha (1<<10)
                    parshaName = desc;
                } else if (e.getDesc() === 'Candle lighting') {
                    // Extract HH:MM from date object
                    const d = e.eventTime;
                    candleTime = d.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
                } else if (e.getDesc() === 'Havdalah') {
                    const d = e.eventTime;
                    havdalahTime = d.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
                } else {
                    // Collect other events (Holidays, Rosh Chodesh)
                    if (!desc.includes('הדלקת נרות') && !desc.includes('הבדלה')) {
                        holidays.push(desc);
                    }
                }
            });

            // 3. Calculate Rabenu Tam (72 mins after Saturday Sunset)
            const zmanimSat = new Zmanim(JERUSALEM, saturday);
            const satSunset = zmanimSat.sunset();
            const rtDate = new Date(satSunset.getTime() + 72 * 60000);
            const rtTime = rtDate.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });

            setZmanim(zmanimData);
            setHebrewDate({
                hebrew: hdate.renderGematriya(),
                monthName: Locale.gettext(hdate.getMonthName(), 'he'), // Hebrew month name (e.g. שבט)
                isLeapYear: hdate.isLeapYear(),
                gd: now.toDateString() // Placeholder
            });
            setShabbatInfo({
                parsha: parshaName || 'לא נמצאה פרשה',
                candles: candleTime,
                havdalah: havdalahTime,
                rabenuTam: rtTime,
                holidays: holidays.join(' • ')
            });

            setLoading(false);
        } catch (err) {
            console.error('Error calculating Zmanim:', err);
            setLoading(false);
        }
    };

    useEffect(() => {
        calculateData();
        // Recalculation happens on page reload (Sun/Wed)
    }, [shulMethod]);

    return { zmanim, hebrewDate, shabbatInfo, loading };
};
