<template>
  <div class="weather">
    <div class="location-box">
      <div class="location">{{ city }}</div>
      <div class="date-title">Local date & time:</div>
      <div class="date">{{ formattedDate }}</div>
    </div>

    <div class="weather-wrapper">
      <div class="weather-now">
        <div class="weather-now-icon">
          <img
            :src="getWeatherIconUrl(weather.weather[0].icon)"
            alt="weather icon"
            width="100"
          />
        </div>

        <div class="weather-now-status">{{ weather.weather[0].main }}</div>

        <div class="weather-now-temp">
          {{ Math.round(weather.main.temp) }}°C
        </div>

        <div class="weather-now-temp-minmax">
          High: {{ weather.main.temp_max.toFixed() }}°C | Low:
          {{ weather.main.temp_min.toFixed() }}°C
        </div>

        <ul class="weather-now-etc">
          <li>
            <div class="icon-text">
              <span class="icon has-text-light">
                <svg-icon type="mdi" :path="pathRealFeel"></svg-icon>
              </span>
              <span
                >Real feel: {{ Math.round(weather.main.feels_like) }}°C</span
              >
            </div>
          </li>
          <li>
            <div class="icon-text">
              <span class="icon has-text-light">
                <svg-icon type="mdi" :path="pathHumidity"></svg-icon>
              </span>
              <span>Humidity: {{ weather.main.humidity }}%</span>
            </div>
          </li>
          <li>
            <div class="icon-text">
              <span class="icon has-text-light">
                <svg-icon type="mdi" :path="pathWind"></svg-icon>
              </span>
              <span>Wind: {{ Math.round(weather.wind.speed) }} m/s</span>
            </div>
          </li>
        </ul>
      </div>

      <ul class="weather-forecast">
        <li
          v-for="hour in forecast"
          :key="hour.dt"
          class="weather-forecast-hourly"
        >
          {{ getFormattedForecast(hour) }}
          <div class="weather-forecast-temp">
            <img
              :src="getWeatherIconUrl(hour.weather[0].icon)"
              alt="weather icon"
              width="60"
              class="weather-forecast-icon"
            />
            {{ Math.round(hour.main.temp) }}°C
          </div>
          <div class="weather-forecast-status">{{ hour.weather[0].main }}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { buildDate } from '../utils';
import { getIcon } from '../api/weather';
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiThermometerLines, mdiWater, mdiWeatherWindy } from '@mdi/js';

export default {
  name: 'WeatherDisplay',
  components: {
    SvgIcon
  },
  data() {
    return {
      pathRealFeel: mdiThermometerLines,
      pathHumidity: mdiWater,
      pathWind: mdiWeatherWindy
    };
  },
  props: {
    city: String,
    weather: Object,
    forecast: Array,
    showWeather: Boolean
  },
  computed: {
    formattedDate() {
      return buildDate(this.weather.dt, this.weather.timezone);
    }
  },
  methods: {
    getWeatherIconUrl(icon) {
      if (
        this.weather &&
        this.weather.weather &&
        this.weather.weather.length > 0
      ) {
        return getIcon(icon);
      }
      return '';
    },
    getFormattedForecast(hour) {
      return buildDate(hour.dt, this.weather.timezone);
    }
  }
};
</script>
