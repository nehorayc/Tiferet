import { useState, useEffect, useRef } from 'react';
import Papa from 'papaparse';
import { isWithinInterval, parse, startOfDay } from 'date-fns';

// Mapping of shul keys to their respective Google Sheet IDs
const SHUL_SHEETS = {
    tiferet: '1vYXNWvbean4RVsGU2FmO93cF0nLtKeAotGs1bz3SBlY',
    hever_kolel: '1zTNQlK1lQFSuTcSc-CJNLr6GLwLPoKsLkhCJYe0_4Nk',
    // Add other synagogues here, e.g.:
    // or_chaim: 'ANOTHER_SHEET_ID_HERE',
};



export const useGoogleSheets = () => {
    // Function to determine which sheet to load based on the URL (?shul=xyz)
    const getSheetId = () => {
        // use window.location.href or search 
        const urlParams = new URLSearchParams(window.location.search);
        const shulParam = urlParams.get('shul')?.toLowerCase();

        // Return the matching sheet ID, or default to 'tiferet'
        return SHUL_SHEETS[shulParam] || SHUL_SHEETS['tiferet'];
    };

    const SHEET_ID = getSheetId();
    const CACHE_KEY = `cached_data_${SHEET_ID}`;

    const getGvizUrl = (sheetName) => `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;

    const [data, setData] = useState({ settings: {}, messages: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Keep a stable ref to the latest fetchData to avoid stale closures in intervals
    const fetchDataRef = useRef(null);

    const fetchData = async () => {
        try {
            // Fetch Settings
            const settingsResponse = await fetch(getGvizUrl('Settings'));
            if (!settingsResponse.ok) throw new Error('Settings check failed');
            const settingsCsv = await settingsResponse.text();

            // We parse without headers because of a formatting issue in the CSV
            // where the first data row is squished into the column headers themselves.
            const settingsParsed = Papa.parse(settingsCsv, { header: false }).data;

            const settingsMap = {};
            settingsParsed.forEach((row, index) => {
                if (!row || row.length < 2) return;

                const key = row[0]?.trim();
                const value = row[1]?.trim();

                if (!key) return;

                // Handle the case where headers and first row data are merged
                // Example: row[0] = "Key ShulName City", row[1] = "Value כולל מעלה חבר Hebron, Israel"
                if (index === 0 && key.startsWith('Key')) {
                    if (value && value.startsWith('Value')) {
                        // Extract everything after 'Value '
                        let potentialName = value.replace(/^Value\s*/i, '').trim();
                        // Isolate the Hebrew text for the ShulName (removes English city names at the end)
                        const hebrewMatch = potentialName.match(/[\u0590-\u05FF\s"'-]+/);
                        if (hebrewMatch && hebrewMatch[0].trim()) {
                            settingsMap['ShulName'] = hebrewMatch[0].trim();
                        } else if (potentialName) {
                            settingsMap['ShulName'] = potentialName;
                        }
                    }
                } else if (key !== 'Key') {
                    settingsMap[key] = value;
                }
            });

            // Fetch Messages
            const messagesResponse = await fetch(getGvizUrl('Messages'));
            if (!messagesResponse.ok) throw new Error('Messages check failed');
            const messagesCsv = await messagesResponse.text();
            const messagesParsed = Papa.parse(messagesCsv, { header: true }).data;

            // Fetch Azkarot
            let azkarotData = [];
            try {
                const azkarotResponse = await fetch(getGvizUrl('Azkarot'));
                if (azkarotResponse.ok) {
                    const azkarotCsv = await azkarotResponse.text();
                    azkarotData = Papa.parse(azkarotCsv, { header: true }).data;
                }
            } catch (e) {
                console.warn('Azkarot sheet not found or inaccessible');
            }

            // Fetch Zmanim (Prayer Times)
            let zmanimSheetData = [];
            try {
                const zmanimResponse = await fetch(getGvizUrl('Zmanim'));
                if (zmanimResponse.ok) {
                    const zmanimCsv = await zmanimResponse.text();
                    zmanimSheetData = Papa.parse(zmanimCsv, { header: true }).data;
                }
            } catch (e) {
                console.warn('Zmanim sheet not found or inaccessible');
            }

            const today = startOfDay(new Date());

            const filteredMessages = messagesParsed.filter(msg => {
                const title = msg.title || msg['title'];
                if (!title) return false;

                const startDate = msg.startDate || msg['startDate'];
                const endDate = msg.endDate || msg['endDate'];

                if (!startDate || !endDate) return true;

                try {
                    const start = parse(startDate, 'dd/MM/yyyy', new Date());
                    const end = parse(endDate, 'dd/MM/yyyy', new Date());
                    return isWithinInterval(today, { start, end });
                } catch (e) {
                    return true;
                }
            });

            const newData = {
                settings: settingsMap,
                messages: filteredMessages,
                azkarot: azkarotData,
                zmanimSheet: zmanimSheetData
            };

            setData(prevData => {
                const newDataString = JSON.stringify(newData);
                const prevDataString = JSON.stringify(prevData);
                if (newDataString !== prevDataString) {
                    localStorage.setItem(CACHE_KEY, newDataString);
                    return newData;
                }
                return prevData;
            });
            setLoading(false);
            setError(null);
        } catch (err) {
            console.error('Error fetching sheets, checking cache:', err);

            // If we already have data in state (from a previous successful fetch or initial cache load), 
            // just keep using it and don't show the error screen.
            if (data.messages?.length > 0 || data.settings?.ShulName) {
                console.log('Fetch failed but app is running with existing/cached data.');
                setLoading(false);
                return;
            }

            setError(err);
            setLoading(false);
        }
    };

    // Always keep the ref pointing at the latest fetchData
    useEffect(() => {
        fetchDataRef.current = fetchData;
    });

    useEffect(() => {
        // Initial load from cache to prevent blank screen if offline on boot
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            try {
                setData(JSON.parse(cached));
                setLoading(false);
            } catch (e) {
                console.error('Failed to parse cached data');
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        const intervalMinutes = parseInt(data.settings?.UpdateIntervalMinutes, 10) || 60;
        const intervalMs = intervalMinutes * 60 * 1000;

        console.log(`[useGoogleSheets] Update interval set to ${intervalMinutes} minutes.`);

        // Use the ref so the interval always calls the latest fetchData (no stale closure)
        const timer = setInterval(() => {
            fetchDataRef.current?.();
        }, intervalMs);

        return () => clearInterval(timer);
    }, [data.settings?.UpdateIntervalMinutes]);

    return { data, loading, error, refetch: fetchData };
};
