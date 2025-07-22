'use client';

import { useEffect, useState } from 'react';

interface WeatherData {
  temperature: number;
  description: string;
  icon: string;
  city: string;
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error('Геолокація не підтримується браузером');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}&units=metric&lang=ua`
          );
          const data = await res.json();

          const weatherInfo: WeatherData = {
            temperature: Math.round(data.main.temp), 
            description: data.weather[0].description,
            icon: data.weather[0].icon,
            city: data.name,
          };

          setWeather(weatherInfo);
        } catch (err) {
          console.error('Помилка завантаження погоди:', err);
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error('Не вдалося отримати геолокацію:', error);
        setLoading(false);
      }
    );
  }, []);

  if (loading) return <div className="text-sm text-gray-500">Loading weather...</div>;
  if (!weather) return <div className="text-sm text-red-500">No weather data</div>;

  return (
    <div className="flex gap-2 items-center">
      <h3 className="flex gap-2 items-center">
                <img
          src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
          alt="weather icon"
          className="w-6 h-6"
        />
      {weather.city}
      </h3>
      <div className="flex">

        <div>
          <div className="">{weather.temperature}°C</div>
          {/* <div className="capitalize text-base text-gray-800">{weather.description}</div> */}
        </div>
      </div>
    </div>
  );
}
