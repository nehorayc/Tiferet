import { useState, useEffect } from 'react';

export const useWeather = () => {
    const [weather, setWeather] = useState(null);

    const fetchWeather = async () => {
        try {
            // Jerusalem Coordinates
            const lat = 31.7683;
            const lon = 35.2137;
            const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
            const data = await response.json();
            if (data.current_weather) {
                setWeather({
                    temp: Math.round(data.current_weather.temperature),
                    code: data.current_weather.weathercode
                });
            }
        } catch (err) {
            console.error('Weather fetch error:', err);
        }
    };

    useEffect(() => {
        fetchWeather();
        // Recalculation happens on page reload (Sun/Wed)
    }, []);

    return weather;
};
