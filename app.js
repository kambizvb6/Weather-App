import { getWeekDay } from "./utils/customDate.js";
import getWeatherData from "./utils/httpReq.js";
import { showModal, removeModal } from "./utils/modal.js";

const searchInput = document.querySelector("input");
const searchButton = document.querySelector("button");
const weatherContainer = document.getElementById("weather");
const locationIcon = document.getElementById("location");
const forecastContainer = document.getElementById("forecast");
const modalButton = document.getElementById("modal-button");
const loader = document.getElementById("loader");

const renderCurrentWeather = (data) => {
  loader.style.display = "inline-block";
  if (!data) return;
  const weatherJSC = `
  <h1> 
  ${data.name}, ${data.sys.country}
  </h1>
  <div id="main">
        <img alt="weather icon" src="https://openweathermap.org/img/w/${
          data.weather[0].icon
        }.png"/>
        <span> ${data.weather[0].main} </span>
        <p> ${Math.round(data.main.temp)} °C</p>
  </div>
  <div id="info">
        <p> Humidity: <span> ${data.main.humidity} %</span> </p>
        <p> Win Speed: <span> ${data.wind.speed} m/s</span> </p>
  </div>
  `;
  weatherContainer.innerHTML = weatherJSC;
  loader.style.display = "none";
};



const renderForecastWeather = (data) => {
  loader.style.display = "inline-block";
  if (!data) return;
  data = data.list.filter((obj) => obj.dt_txt.endsWith("12:00:00"));
  forecastContainer.innerHTML = "";
  data.forEach((i) => {
    const forecastJSX = `
    <div id="day-s">
        <img alt="weather icon" src="https://openweathermap.org/img/w/${
          i.weather[0].icon
        }.png" />
        <h3> ${getWeekDay(i.dt)} </h3>
        <p> ${Math.round(i.main.temp)} </p>
        <span> ${i.weather[0].main}</span>
    </div>
    `;

    forecastContainer.innerHTML += forecastJSX;
    loader.style.display = "none";
  });
};
const searchHandler = async () => {
  const cityName = searchInput.value;
  if (!cityName) {
    showModal("Please Enter City Name");
  }
  const currentData = await getWeatherData("current", cityName);
  renderCurrentWeather(currentData);

  const forecastData = await getWeatherData("forecast", cityName);
  renderForecastWeather(forecastData);
};

const positionCallback = async (position) => {
  const currentData = await getWeatherData("current", position.coords);
  searchInput.value = currentData.name;
  renderCurrentWeather(currentData);
  const forecastData = await getWeatherData("forecast", position.coords);
  renderForecastWeather(forecastData);
};

const errorCallback = (error) => {
  showModal(error.message);
};

const locationHandler = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(positionCallback, errorCallback);
  } else {
    showModal("Your browser dose not support geolocation");
  }
};

const initHandler = async () => {
  const currentData = await getWeatherData("current", "Regina");
  renderCurrentWeather(currentData);

  const forecastData = await getWeatherData("forecast", "Regina");
  renderForecastWeather(forecastData);
};

searchButton.addEventListener("click", searchHandler);
locationIcon.addEventListener("click", locationHandler);
modalButton.addEventListener("click", removeModal);
document.addEventListener("DOMContentLoaded", initHandler);
