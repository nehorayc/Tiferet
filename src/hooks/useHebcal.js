import { useState, useEffect } from 'react';
import { HDate, Location, Zmanim, HebrewCalendar, Locale } from '@hebcal/core';

// Default to Jerusalem
const JERUSALEM = new Location(31.7683, 35.2137, false, 'Asia/Jerusalem', 'Jerusalem', 'IL', 281184);

export const useHebcal = () => {
    const [zmanim, setZmanim] = useState(null);
    const [hebrewDate, setHebrewDate] = useState(null);
    const [shabbatInfo, setShabbatInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    const calculateData = () => {
        try {
            const now = new Date();
            const hdate = new HDate(now);
            const zman = new Zmanim(JERUSALEM, now);

            // 1. Daily Zmanim
            const zmanimData = {
                alotHaShachar: zman.alotHaShachar().toISOString(),
                misheyakir: zman.misheyakir().toISOString(),
                sunrise: zman.sunrise().toISOString(),
                sofZmanShma: zman.sofZmanShma().toISOString(),
                sofZmanTfilla: zman.sofZmanTfilla().toISOString(),
                chatzot: zman.chatzot().toISOString(),
                minchaGedola: zman.minchaGedola().toISOString(),
                minchaKetana: zman.minchaKetana().toISOString(),
                plagHaMincha: zman.plagHaMincha().toISOString(),
                sunset: zman.sunset().toISOString(),
                tzeitHaKochavim: zman.tzeit().toISOString()
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
        const interval = setInterval(calculateData, 60 * 60 * 1000); // Update hourly
        return () => clearInterval(interval);
    }, []);

    return { zmanim, hebrewDate, shabbatInfo, loading };
};
