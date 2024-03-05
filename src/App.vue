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
          @input="debouncedFetchCities"
          @focus="showCities = true"
          @click.stop
        />

        <button class="clear-button" v-if="city" @click="clearInput">×</button>
      </div>

      <ErrorMessage
        v-if="errorMessage"
        class="is-warning"
        :active="errorMessage !== ''"
      >
        <template #default="">
          <p>{{ errorMessage }}</p>
        </template>

        <template #header>
          <p>Oops...</p>
        </template>
      </ErrorMessage>

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
import ErrorMessage from './components/ErrorMessage.vue';
import { buildDate } from './utils/buildDate';
import { debounce } from './utils/debounce';
import { getCities, getWeather } from './api/weather';

export default {
  name: 'App',
  components: {
    ErrorMessage
  },
  data() {
    return {
      city: '',
      weather: {},
      cities: [],
      showWeather: false,
      showCities: false,
      errorMessage: ''
    };
  },

  computed: {
    formattedDate() {
      return buildDate();
    },
    debouncedFetchCities() {
      return debounce(this.fetchCities, 500);
    }
  },

  mounted() {
    document.addEventListener('click', this.onClickOutside);
  },

  methods: {
    fetchWeather() {
      this.errorMessage = '';
      if (this.city) {
        getWeather(this.city)
          .then(({ data }) => {
            this.weather = data;
            this.showCities = false;
            this.showWeather = true;
          })
          .catch(() => {
            this.showWeather = false;
            this.errorMessage = `Server can't find weather data for this location: ${this.city}.`;
          });
      }
    },

    clearInput() {
      this.city = '';
      this.showWeather = false;
      this.showCities = false;
      this.errorMessage = '';
    },

    fetchCities() {
      this.cities = [];
      this.errorMessage = '';
      if (this.city) {
        getCities(this.city).then(({ data }) => {
          if (data.length) {
            this.cities = new Set(
              data.map((city) => `${city.name}, ${city.country}`)
            );
            this.showCities = true;
          } else {
            this.showWeather = false;
            this.errorMessage = `No city on server matches this query: ${this.city}.`;
          }
        });
      }
    },

    selectCity(suggestion) {
      this.city = suggestion;
      this.showCities = false;
      this.fetchWeather();
    },

    onClickOutside(event) {
      if (this.$refs.dropdown && !this.$refs.dropdown.contains(event.target)) {
        this.showCities = false;
      }
      this.errorMessage = '';
    },

    beforeUnmount() {
      document.removeEventListener('click', this.onClickOutside);
    }
  }
};
</script>
