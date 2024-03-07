<template>
  <div class="weather-wrap" v-if="showWeather">
    <div class="location-box">
      <div class="location">{{ city }}</div>
      <div class="date-title">Local date & time:</div>
      <div class="date">{{ formattedDate }}</div>
    </div>

    <div class="weather-box">
      <div class="weather-icon">
        <img
          :src="weatherIconUrl"
          alt="weather icon"
          width="100"
          height="100"
        />
      </div>
      <div class="temp">{{ Math.round(weather.main.temp) }}°C</div>
      <div class="weather">{{ weather.weather[0].main }}</div>
    </div>
  </div>
</template>

<script>
import { buildDate } from '../utils';
import { getIcon } from '../api/weather';

export default {
  props: {
    city: String,
    weather: Object,
    showWeather: Boolean
  },
  computed: {
    formattedDate() {
      return buildDate(this.weather.dt, this.weather.timezone);
    },
    weatherIconUrl() {
      if (
        this.weather &&
        this.weather.weather &&
        this.weather.weather.length > 0
      ) {
        return getIcon(this.weather.weather[0].icon);
      }
      return '';
    }
  }
};
</script>
