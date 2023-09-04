import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import WeatherCard from './components/WeatherCard';

function App() {
  const [coords, setCoords] = useState();
  const [weather, setWeather] = useState();
  const [temps, setTemps] = useState({ celsius: null, fahrenheit: null });
  const [error, setError] = useState(null); 
  const [isLoading, setIsLoading] = useState(true);
  const [isCelsius, setIsCelsius] = useState(true); 
  const weatherBackgrounds = {
    Clear: "https://okdiario.com/img/2021/12/13/-cual-es-la-temperatura-del-sol_-655x368.jpg",
    Clouds: "https://img.freepik.com/foto-gratis/lluvia-negro-abstracto-oscuro-poder_1127-2380.jpg?w=740&t=st=1693783692~exp=1693784292~hmac=1044a04c3c39574c4bd2b74ac5a61aa9bfa30a7f8684ab4c1029698053452acb",
    Rain: "https://services.meteored.com/img/article/microfisica-de-nubes-y-formacion-de-la-lluvia-1670754813980_1024.jpeg",
    Thunderstorm: "https://gestion.pe/resizer/FiVaCfVpN8o17iOIe1xDqX1rBSs=/580x330/smart/filters:format(jpeg):quality(75)/cloudfront-us-east-1.images.arcpublishing.com/elcomercio/2ZS3MPXPBBACJLPEA2DN76326Y.jpg",
  }

  const backgroundStyle = {
    backgroundImage: `url(${weatherBackgrounds[weather?.weather[0]?.main] || weatherBackgrounds.default})`,
  }

  const handleChangeTemps = () => {
    setIsCelsius(!isCelsius);
  }; 

  useEffect(() => {
    const success = (pos) => {
      const obj = {
        lat: pos.coords.latitude,
        lon: pos.coords.longitude,
      };
      setCoords(obj);
    };

    const handleError = (err) => {
      setError("Geolocation permission error: " + err.message);
      setIsLoading(false);
    };

    navigator.geolocation.getCurrentPosition(success, handleError);
  }, []);

  useEffect(() => {
    if (coords) {
      const APIKey = "b416d722f2b236e5520101010d3bf923";
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${APIKey}`;

      axios
        .get(url)
        .then((res) => {
          setWeather(res.data);
          const obj = {
            celsius: (res.data.main.temp - 273.15).toFixed(1),
            fahrenheit: ((res.data.main.temp - 273.15) * 9/5 + 32).toFixed(1),
          };
          setTemps(obj);
          setIsLoading(false);
        })
        .catch((err) => {
          setError("Error al obtener datos del clima: " + err.message);
          setIsLoading(false);
          console.log(err);
        });
    }
  }, [coords]);

  useEffect(() => {
    if (weather && weather?.weather[0]?.main) {
      document.body.style.backgroundImage = `url(${weatherBackgrounds[weather.weather[0].main] || weatherBackgrounds.default})`;
    }
  }, [weather]);

  return (
    <article style={backgroundStyle}>
    {isLoading ? (
      <p class="loading-message">Loading...</p>
      ) : (
        <>
          {error ? (
            <div className="error-message">{error}</div>
            ) : (
              <>
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
              <h2>{isCelsius ? `${temps.celsius} °C` : `${temps.fahrenheit} °F`}</h2>
              <button className="boton" onClick={handleChangeTemps}>
                {isCelsius ? 'Change to °F' : 'Change to °C'}
              </button>
            </>
          )}
        </>
      )}
    </article>
  );
}

export default App;
