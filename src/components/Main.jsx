import React, { useState, useRef, useEffect } from 'react';
import Header from './Header';
import './styles.css';

import clear from '../assets/clear.png';
import clouds from '../assets/clouds.png';
import drizzle from '../assets/drizzle.png';
import mist from '../assets/mist.png';
import snow from '../assets/snow.png';
import rain from '../assets/rain.png';

export default function Main() {
    const city = useRef();
    const [weatherData, setWeatherData] = useState({
        data: undefined,
        error: true,
        city: undefined,
        feel_like: null,
        temperature: null,
        windSpeed: null,
        humidity: null,
    });
    const [forecasts, setForecasts] = useState({ list: [] });
    const [icon, setIcon] = useState('');
    let image = '';

    function calculateTemp(temperature) {
        return (temperature - 273.15).toFixed(2);
    }

    function filterClouds(skyState) {
        switch (skyState) {
            case "Clouds":
                image = clouds;
                break;
            case "Clear":
                image = clear;
                break;
            case "Rain":
                image = rain;
                break;
            case "Drizzle":
                image = drizzle;
                break;
            case "Mist":
                image = mist;
                break;
            default:
                image = snow;
        }
        setIcon(image)
    }

    async function getLondonWeather() {
        try {
            const apiKey = '0e8b6b73c7baa70fe26a80b72f3a0e18';
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=London&appid=${apiKey}`);
            if (!response.ok) {
                throw new Error("An error has occurred");
            }
            const result = await response.json();
            const cityName = result.name
            console.log(result);
            filterClouds(result.weather[0].main)

            //const temp = (result.main.temp - 273.15).toFixed(2);
            //const feel = (result.main.feels_like - 273.15).toFixed(2);
            const wind_speed = (result.wind.speed * 3.6).toFixed(2);
            const humidity = result.main.humidity;

            setWeatherData({
                error: false,
                data: result,
                city: cityName,
                feel_like: calculateTemp(result.main.feels_like),
                temperature: calculateTemp(result.main.temp),
                windSpeed: wind_speed,
                humidity: humidity
            });
        } catch (error) {
            console.error(error);
            setWeatherData({
                error: true,
                data: undefined,
                city: undefined,
                feel_like: null,
                temperature: null,
                windSpeed: null,
                humidity: null
            });
        }
    }

    async function getWeather() {
        try {
            const apiKey = '0e8b6b73c7baa70fe26a80b72f3a0e18';
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city.current.value}&appid=${apiKey}`);
            if (!response.ok) {
                throw new Error("An error has occurred");
            }
            const result = await response.json();
            console.log(result);
            const cityName = result.name
            filterClouds(result.weather[0].main)

            const wind_speed = (result.wind.speed * 3.6).toFixed(2);
            const humidity = result.main.humidity;

            setWeatherData({
                error: false,
                data: result,
                city: cityName,
                feel_like: calculateTemp(result.main.feels_like),
                temperature: calculateTemp(result.main.temp),
                windSpeed: wind_speed,
                humidity: humidity
            });
        } catch (error) {
            console.error(error);
            setWeatherData({
                error: true,
                data: undefined,
                city: undefined,
                feel_like: null,
                temperature: null,
                windSpeed: null,
                humidity: null
            });
        }
    }

    async function getLondonForecasts() {
        try {
            const apiKey = '0e8b6b73c7baa70fe26a80b72f3a0e18'
            const response = await fetch(`http://api.openweathermap.org/data/2.5/forecast?q=London&appid=${apiKey}`)
            if (!response.ok) {
                setForecasts(undefined)
                throw new Error("An error has been occured")
            }
            const result = await response.json()
            console.log(result)
            setForecasts(result)

        }
        catch (error) {
            setForecasts(undefined)
            console.log(error.message)
        }
    }

    async function getForecasts() {
        try {
            const apiKey = '0e8b6b73c7baa70fe26a80b72f3a0e18'
            const response = await fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${city.current.value}&appid=${apiKey}`)
            if (!response.ok) {
                setForecasts(undefined)
                throw new Error("An error has been occured")
            }
            const result = await response.json()
            console.log(result)
            setForecasts(result)

        }
        catch (error) {
            setForecasts(undefined)
            console.log(error.message)
        }
    }

    async function get_location_weather() {
        try {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(async function (position) {
                    var latitude = position.coords.latitude;
                    var longitude = position.coords.longitude;
                    var api_url = 'https://nominatim.openstreetmap.org/reverse?lat=' + latitude + '&lon=' + longitude + '&format=json';
                    try {
                        const response = await fetch(api_url);
                        const data = await response.json();
                        const cityName = data.address.city;
                        console.log(cityName)
                        const apiKey = '0e8b6b73c7baa70fe26a80b72f3a0e18';
                        const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`);


                        if (!weatherResponse.ok) {
                            setWeatherData({
                                error: true,
                                data: undefined,
                                city: undefined,
                                feel_like: null,
                                temperature: null,
                                windSpeed: null,
                                humidity: null
                            });
                            throw new Error("An error has occurred");
                        }
                        const weatherData = await weatherResponse.json();

                        const wind_speed = (weatherData.wind.speed * 3.6).toFixed(2);
                        const humidity = weatherData.main.humidity;

                        filterClouds(weatherData.weather[0].main)
                        setWeatherData({
                            error: true,
                            data: undefined,
                            city: cityName,
                            feel_like: calculateTemp(weatherData.main.feels_like),
                            temperature: calculateTemp(weatherData.main.temp),
                            windSpeed: wind_speed,
                            humidity: humidity
                        });

                    } catch (error) {
                        console.log("Error fetching weather data:", error);
                        setWeatherData({
                            error: true,
                            data: undefined,
                            city: undefined,
                            feel_like: null,
                            temperature: null,
                            windSpeed: null,
                            humidity: null
                        });
                    }
                });
            } else {
                console.log("La géolocalisation n'est pas prise en charge par ce navigateur.");
            }
        } catch (error) {
            console.log("Error in get_position_current_weather:", error);
            setWeatherData({
                error: true,
                data: undefined,
                city: undefined,
                feel_like: null,
                temperature: null,
                windSpeed: null,
                humidity: null
            });
        }
    }

    async function get_location_forecasts() {
        try {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(async function (position) {
                    var latitude = position.coords.latitude;
                    var longitude = position.coords.longitude;
                    var api_url = 'https://nominatim.openstreetmap.org/reverse?lat=' + latitude + '&lon=' + longitude + '&format=json';
                    try {
                        const response = await fetch(api_url);
                        const data = await response.json();
                        const cityName = data.address.city;

                        const apiKey = '0e8b6b73c7baa70fe26a80b72f3a0e18';
                        const weatherResponse = await fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`);

                        if (!weatherResponse.ok) {
                            setForecasts(undefined);
                            throw new Error("An error has occurred");
                        }
                        const result = await weatherResponse.json();
                        console.log(result);
                        setForecasts(result);
                    } catch (error) {
                        console.log("Error fetching weather data:", error);
                        setForecasts(undefined);
                    }
                });
            } else {
                console.log("This browser don't take charge the geolocalisation");
            }
        } catch (error) {
            console.log("Error in get_position_current_forecasts:", error);
            setForecasts(undefined);
        }
    }

    function get_location_data() {
        get_location_weather();
        get_location_forecasts();
    }
    function handleSubmit(event) {
        event.preventDefault();
        getWeather();
        getForecasts();
    }
    useEffect(() => {
        getLondonWeather();
        getLondonForecasts();
    }, []);

    return (
        <>
            <Header />
            <div className="global-container">
                <div className="left-side">
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="city">Enter a City Name</label>
                        <input ref={city} id='city' type="text" placeholder='E.g., New York, London, Tokyo' />
                        <button onClick={handleSubmit}>Search</button>
                    </form>
                    <div className="choice">
                        <div></div>
                        <span>or</span>
                        <div></div>
                    </div>
                    <button onClick={get_location_data}>Use Current Location</button>
                </div>
                <div className="right-side">
                    <div className="weather-data">
                        <div className="data">
                            <h1 style={{ fontSize: "35px", color: "#fff" }}>{weatherData.city}</h1>
                            <p>Temperature : {weatherData.temperature}°C</p>
                            <p>Feels like : {weatherData.feel_like}°C</p>
                            <p>Wind speed 💨 : {weatherData.windSpeed}km/h</p>
                            <p>Humidity 💧: {weatherData.humidity}%</p>
                        </div>
                        <div className="sky-state">
                            <img src={icon} alt="Clouds" />
                            <p style={{ fontSize: '35px', fontWeight: "bolder" }}>{weatherData.data && weatherData.data.weather && weatherData.data.weather[0].main}</p>
                        </div>
                    </div>
                    <div className="forecasts-shape">
                        <h1 style={{ textDecoration: "underLine" }}>Forecasts for the next hours</h1>
                        <div style={{ marginTop: "10px" }} className="forecasts-row">
                            {forecasts.list.slice(0, 6).map(forecast => (
                                <div key={forecast.dt}>
                                    <p style={{ fontWeight: "bolder" }}>{forecast.dt_txt}</p>
                                    <p>Temp : <span style={{ fontWeight: "bolder", color: "#f1f1f1" }}>{(forecast.main.temp - 273.15).toFixed(2)} °C</span></p>
                                    <p>Feel like : <span style={{ fontWeight: "bolder", color: "#f1f1f1" }}>{(forecast.main.feels_like - 273.15).toFixed(2)} °C</span></p>
                                    <p>Humidity 💧: {forecast.main.humidity}%</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
