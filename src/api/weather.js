import { API_KEY, client } from '../utils';

export const getWeather = (lat, lon) => {
  return client.get(`data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&APPID=${API_KEY}`);
};

export const getCities = (city) => {
  return client.get(`geo/1.0/direct?q=${city}&limit=5&APPID=${API_KEY}`);
};

export const getHourlyForecast = (lat, lon) => {
  return client.get(`data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=8&units=metric&APPID=${API_KEY}`);
};

export const getIcon = (code) => {
  console.log(code);
  return `http://openweathermap.org/img/wn/${code}@2x.png`;
};
