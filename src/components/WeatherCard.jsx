import React, { useState } from 'react';
import './weather-card.css';


const WeatherCard = ({ weather }) => {
  const [isCelsius, setIsCelsius] = useState(true);

  const handleChangeTemps = () => {
    setIsCelsius(!isCelsius);
  };

  const temperature = isCelsius ? weather?.main.temp : (weather?.main.temp * 9/5) + 32;

  return (
    <article class="all">
      <h1>Weather App</h1>
      <h2>{weather?.name}, {weather?.sys.country}</h2>
      <div>
        <img src={weather && `https://openweathermap.org/img/wn/${weather?.weather[0].icon}@4x.png`} alt="" />
      </div>
      <section>
        <h3>{weather?.weather[0].description}</h3>
        <ul>
          <li><span>Wind speed</span><span>{weather?.wind.speed} m/s</span></li>
          <li><span>Cloudy</span><span>{weather?.clouds.all}%</span></li>
          <li><span>Pressure</span><span>{weather?.main.pressure} hpa</span></li>
        </ul>
      </section>
      <h2>{isCelsius ? `${temperature} °C` : `${temperature} °F`}</h2>
      <button class="boton" onClick={handleChangeTemps}>
        {isCelsius ? 'Change to °F' : 'Change to °C'}
      </button>
    </article>
  );
};

export default WeatherCard;
