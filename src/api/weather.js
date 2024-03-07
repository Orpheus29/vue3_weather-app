import { API_KEY, client } from '../utils';

export const getWeather = (lat, lon) => {
  return client.get(`data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&APPID=${API_KEY}`);
};

export const getCities = (city) => {
  return client.get(`geo/1.0/direct?q=${city}&limit=10&APPID=${API_KEY}`);
};

export const getHourlyForecast = (city) => {
  return client.get(`data/2.5/forecast?q=${city}&cnt=8&APPID=${API_KEY}`);
};

export const getIcon = (code) => {
  return `http://openweathermap.org/img/wn/${code}@2x.png`;
};
