import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";
import Current from "./Component/Current";
import Forecast from "./Component/Forecast";
import '../node_modules/bootstrap/dist/js/bootstrap';
// app.js

export default function App() {
  const [city, setCity] = useState();
  const [clickedCity, setclickedCity] = useState();
  const [citySuggestion, setCitysuggestion] = useState([]);
  const [currentWeather, setCurrent] = useState();
  const [forecastWeather, setForecast] = useState();
  const [location, setLocation] = useState();


  const autoCompURL =
    "https://api.weatherapi.com/v1/search.json?key=a21706f4413e4127bfe123045242210&q=";

  const WeatherURL = (city) => `https://api.weatherapi.com/v1/forecast.json?key=a21706f4413e4127bfe123045242210&q=${city}&days=7&aqi=no&alerts=no`;

  useEffect(
    () => {
      if (city && city.length > 3) {
        fetchAutocomAPI();

      }
    },
    [city]
  );

  const fetchAutocomAPI = async () => {
    try {
      const response = await axios.get(autoCompURL + city);
      const resp = response.data;
      console.log(resp);
      const citydata = resp.map((data) => {
        return `${data.name}, ${data.region}, ${data.country}`;
      });
      setCitysuggestion(citydata);
    } catch (e) {
      console.log("error", e);
    }
  };

  const handleSelectedCity = (city) => {
    console.log('clicked city', city);
    setclickedCity(city);
    fetchWeatherAPI(city);
    setCitysuggestion([]);
  };
  const fetchWeatherAPI = async (city) => {
    try {
      const response = await axios.get(WeatherURL(city));
      const resp = response.data;
      // console.log(resp);
      setCurrent(resp.current);
      setForecast(resp.forecast);
      setLocation(resp.location);
      console.log("Current", resp.current);
      console.log("Forecast", resp.forecast);
      console.log("location", resp.location);

    } catch (e) {
      console.log("weather API error", e);
    }


  }

  return (
    <div className="container  bg-success p-5 mt-5">
      <input
        type="text"
        value={clickedCity}
        className="form-control"
        onChange={(e) => {
          setCity(e.target.value);
          if(e.target.value===""){
            setCurrent();
            setForecast();
            setLocation();
            setclickedCity();
          }
        }}
      />
      {citySuggestion &&
        citySuggestion.map((city, index) => {
          return (
            <div key={index} className="text-center bg-info rounded p-1 bg-opacity-10 border-info border-opacity-25 text-white"
              style={{ cursor: "pointer" }}
              onClick={() => handleSelectedCity(city)}>
              {city}
            </div>
          );
        })}
      {currentWeather && <Current currentWeather={currentWeather} location={location} />}
      {forecastWeather && <Forecast forecastWeather={forecastWeather} location={location} />}
    </div>
  );
}

