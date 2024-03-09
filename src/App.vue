<template>
  <div id="app" :class="weatherClass">
    <main>
      <div class="title">Weather App</div>

      <div class="city-search">
        <div class="search-box">
          <input
            type="text"
            class="search-bar"
            placeholder="Type city name"
            v-model="city[0]"
            @input="debouncedFetchCities"
            @focus="(showCities = true), (errorMessage = '')"
            @keyup.down="onArrowDown"
            @keyup.esc="clearInput"
            @keyup.enter="onEnter"
            @keyup.up="onArrowUp"
            @click.stop
          />

          <button class="clear-button" v-if="city.length" @click="clearInput">
            ×
          </button>
        </div>

        <TransitionGroup name="list">
          <ul
            v-if="showCities && cities.length"
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
              {{ city[0] }}
            </li>
          </ul>
        </TransitionGroup>
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

      <WeatherDisplay
        v-if="showWeather"
        :city="location"
        :weather="weather"
        :forecast="forecast"
        :showWeather="showWeather"
      />
    </main>
  </div>
</template>

<script>
import ErrorMessage from './components/ErrorMessage.vue';
import WeatherDisplay from './components/WeatherDisplay.vue';
import { buildDate, debounce, ERRORS } from './utils';
import { getCities, getWeather, getHourlyForecast } from './api/weather';

export default {
  name: 'App',
  components: {
    ErrorMessage,
    WeatherDisplay
  },
  data() {
    return {
      city: [],
      weather: {},
      forecast: [],
      cities: [],
      lastCity: '',
      showWeather: false,
      showCities: false,
      errorMessage: '',
      arrowCounter: 0,
      location: ''
    };
  },

  computed: {
    formattedDate() {
      return buildDate();
    },
    debouncedFetchCities() {
      return debounce(this.fetchCities, 500);
    },
    weatherClass() {
      return {
        warm: this.showWeather && this.weather.main.temp > 16
      };
    }
  },

  mounted() {
    document.addEventListener('click', this.onClickOutside);
  },

  methods: {
    fetchWeather() {
      this.errorMessage = '';

      if (this.city && this.city !== this.lastCity) {
        Promise.all([
          getWeather(this.city[1], this.city[2])
            .then(({ data }) => {
              this.weather = data;
              this.showCities = false;
              this.showWeather = true;
              this.location = this.city[0];
            })
            .catch(() => {
              this.showWeather = false;
              this.showCities = false;
              this.errorMessage = `${ERRORS.NO_WEATHER}: ${this.city[0]}.`;
            })
            .finally(() => {
              this.lastCity = this.city;
            }),

          getHourlyForecast(this.city[1], this.city[2])
            .then(({ data }) => {
              this.forecast = data.list;
              console.log(this.forecast);
            })
            .catch(() => {
              this.showWeather = false;
              this.showCities = false;
              this.errorMessage = `${ERRORS.NO_WEATHER}: ${this.city[0]}.`;
            })
        ]);
      }
    },

    clearInput() {
      this.city = [];
      this.cities = [];
      this.showWeather = false;
      this.showCities = false;
      this.errorMessage = '';
    },

    fetchCities() {
      this.errorMessage = '';
      this.city.length = 1;

      if (this.city) {
        getCities(this.city).then(({ data }) => {
          if (data.length) {
            this.cities = data.map((city) => [
              `${city.name}${city.state ? `, ${city.state}` : ''} ${city.country}`,
              city.lat,
              city.lon
            ]);
            this.showCities = true;
          } else {
            this.showWeather = false;
            this.showCities = false;
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
      ev.preventDefault();
      if (this.showCities && this.arrowCounter < this.cities.length - 1) {
        this.arrowCounter = this.arrowCounter + 1;
        console.log(this.arrowCounter);
        this.fixScrolling();
      }
    },

    onArrowUp(ev) {
      ev.preventDefault();
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
      this.city = this.cities[this.arrowCounter];
      console.log(this.cities);
      this.showCities = false;
      this.arrowCounter = -1;
      this.fetchWeather();
    },

    fixScrolling() {
      const liH = this.$refs.options[this.arrowCounter].clientHeight;
      this.$refs.dropdown.scrollTop = liH * this.arrowCounter;
    }
  }
};
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  max-height: 250px;
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(0);
}
</style>
