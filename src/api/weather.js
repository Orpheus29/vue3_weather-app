import { client } from '../utils/httpClient';
import { API_KEY } from '../utils/consts';

export const getWeather = (city) => {
  return client.get(`data/2.5/weather?q=${city}&units=metric&APPID=${API_KEY}`);
};

export const getCities = (city) => {
  return client.get(`geo/1.0/direct?q=${city}&limit=10&APPID=${API_KEY}`);
};
