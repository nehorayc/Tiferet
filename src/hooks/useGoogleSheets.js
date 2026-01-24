import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { isWithinInterval, parse, startOfDay } from 'date-fns';

const SHEET_ID = '1vYXNWvbean4RVsGU2FmO93cF0nLtKeAotGs1bz3SBlY';
const getGvizUrl = (sheetName) => `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;

export const useGoogleSheets = () => {
    const [data, setData] = useState({ settings: {}, messages: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            // Fetch Settings
            const settingsResponse = await fetch(getGvizUrl('Settings'));
            if (!settingsResponse.ok) throw new Error('Settings check failed. Make sure the sheet is shared with "Anyone with the link"');
            const settingsCsv = await settingsResponse.text();
            const settingsParsed = Papa.parse(settingsCsv, { header: true }).data;

            const settingsMap = {};
            settingsParsed.forEach(row => {
                const key = row.Key || row['Key'];
                const value = row.Value || row['Value'];
                if (key) settingsMap[key] = value;
            });

            // Fetch Messages
            const messagesResponse = await fetch(getGvizUrl('Messages'));
            if (!messagesResponse.ok) throw new Error('Messages check failed');
            const messagesCsv = await messagesResponse.text();
            const messagesParsed = Papa.parse(messagesCsv, { header: true }).data;

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

            setData({
                settings: settingsMap,
                messages: filteredMessages
            });
            setLoading(false);
        } catch (err) {
            console.error('Error fetching sheets:', err);
            setError(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5 * 60 * 1000); // 5 minutes
        return () => clearInterval(interval);
    }, []);

    return { data, loading, error, refetch: fetchData };
};
