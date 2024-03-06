<template>
  <div id="app" :class="showWeather && weather.main.temp > 16 ? 'warm' : ''">
    <main>
      <div class="search-box">
        <input
          type="text"
          class="search-bar"
          placeholder="Type city name"
          v-model="city"
          @input="debouncedFetchCities"
          @focus="showCities = true"
          @click.stop
          @keyup.down="onArrowDown"
          @keyup.up="onArrowUp"
          @keyup.enter="onEnter"
          @keyup.esc="clearInput"
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
          @click="selectCity(city, index)"
          ref="options"
          :class="{ 'is-active': index === arrowCounter }"
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
import { buildDate, debounce, ERRORS } from './utils';
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
      lastCity: '',
      showWeather: false,
      showCities: false,
      errorMessage: '',
      arrowCounter: 0
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
      if (this.city && this.city !== this.lastCity) {
        getWeather(this.city)
          .then(({ data }) => {
            this.weather = data;
            this.showCities = false;
            this.showWeather = true;
          })
          .catch(() => {
            this.showWeather = false;
            this.errorMessage = `${ERRORS.NO_WEATHER}: ${this.city}.`;
          })
          .finally(() => {
            this.lastCity = this.city;
          });
      }
    },

    clearInput() {
      this.city = '';
      this.cities.clear();
      this.showWeather = false;
      this.showCities = false;
      this.errorMessage = '';
    },

    fetchCities() {
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
            this.errorMessage = `${ERRORS.NO_CITIES}: ${this.city}.`;
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
      this.arrowCounter = -1;
    },

    beforeUnmount() {
      document.removeEventListener('click', this.onClickOutside);
    },

    onArrowDown(ev) {
      ev.preventDefault()
      if (this.showCities && (this.arrowCounter < this.cities.size - 1)) {
        this.arrowCounter = this.arrowCounter + 1;
        console.log(this.arrowCounter);
        this.fixScrolling();
      }
    },

    onArrowUp(ev) {
      ev.preventDefault()
      if (this.arrowCounter > 0) {
        this.arrowCounter = this.arrowCounter - 1;
        console.log(this.arrowCounter);
        this.fixScrolling();
      }
    },

    onEnter() {
      if (this.arrowCounter === -1) {
        return;
      }
      this.city = Array.from(this.cities)[this.arrowCounter];
      console.log(this.cities);
      this.showCities = false;
      this.arrowCounter = -1;
      this.fetchWeather();
    },
    
    fixScrolling(){
      const liH = this.$refs.options[this.arrowCounter].clientHeight;
      this.$refs.dropdown.scrollTop = liH * this.arrowCounter;
    },
  }
};
</script>
