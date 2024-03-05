<template>
  <div id="app" :class="showWeather && weather.main.temp > 16 ? 'warm' : ''">
    <main>
      <div class="search-box">
        <input
          type="text"
          class="search-bar"
          placeholder="Type city name"
          v-model="city"
          @keyup.enter="fetchWeather"
          @input="debouncedGetCities"
          @focus="showCities = true"
          @click.stop
        />
        <button class="clear-button" v-if="city" @click="clearInput">×</button>
      </div>
      <ul
        v-if="showCities && cities.size"
        ref="dropdown"
        class="autocomplete-dropdown"
      >
        <li
          v-for="(city, index) in cities"
          :key="index"
          @click="selectCity(city)"
        >
          {{ city }}
        </li>
      </ul>
      <div class="weather-wrap" v-if="showWeather">
        <div class="location-box">
          <div class="location">
            {{ weather.name }}, {{ weather.sys.country }}
          </div>
          <div class="date">{{ formattedDate }}</div>
        </div>

        <div class="weather-box">
          <div class="temp">{{ Math.round(weather.main.temp) }}°C</div>
          <div class="weather">{{ weather.weather[0].main }}</div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { buildDate } from './utils/buildDate';
import { debounce } from './utils/debounce';
import { API_KEY, BASE_URL } from './utils/consts';

export default {
  name: 'App',
  data() {
    return {
      city: '',
      weather: {},
      cities: [],
      showWeather: false,
      showCities: false
    };
  },

  computed: {
    formattedDate() {
      return buildDate();
    },
    debouncedGetCities() {
      return debounce(this.getCities, 500);
    }
  },

  mounted() {
    document.addEventListener('click', this.onClickOutside);
  },

  methods: {
    fetchWeather() {
      if (this.city) {
        fetch(
          `${BASE_URL}data/2.5/weather?q=${this.city}&units=metric&APPID=${API_KEY}`
        )
          .then((res) => res.json())
          .then((data) => {
            if (data.cod === 200) {
              this.weather = data;
              this.showCities = false;
              this.showWeather = true;
            } else {
              console.error(
                `The server can't find weather data for ${this.city}.`
              );
            }
          })
          .catch((error) => {
            console.error(
              `The server can't find weather data for ${this.city}. `,
              error
            );
          });
      }
    },

    clearInput() {
      this.city = '';
      this.showWeather = false;
      this.showCities = false;
    },

    getCities() {
      this.cities = [];
      if (this.city) {
        fetch(
          `${BASE_URL}geo/1.0/direct?q=${this.city}&limit=10&APPID=${API_KEY}`
        )
          .then((response) => response.json())
          .then((data) => {
            this.cities = new Set(data.map((city) => `${city.name}, ${city.country}`));
            this.showCities = true;
          })
          .catch((error) => {
            console.error('Error fetching autocomplete suggestions:', error);
          });
      }
    },

    selectCity(suggestion) {
      this.city = suggestion;
      console.log(this.city);
      this.showCities = false;
      this.fetchWeather();
    },

    onClickOutside(event) {
      if (this.$refs.dropdown && !this.$refs.dropdown.contains(event.target)) {
        this.showCities = false;
      }
    },

    beforeUnmount() {
      document.removeEventListener('click', this.onClickOutside);
    }
  }
};
</script>
