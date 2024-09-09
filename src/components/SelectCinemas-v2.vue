<template>
  <div>
    <h1 class="text-center pull-left" style="width: 100%; margin-top: 0px;">Rạp Chiếu Phim</h1>
    <ul class="nav nav-tabs dayofweek"
        style="display: flex; justify-content: center; margin-bottom: 10px; margin-left: 1%; margin-right: 1%;">
      <li v-for="date in availableDates" :key="date" :class="{ active: date === selectedDate }"
          style="margin-right: 10px;">
        <a @click="selectDate(date)" class="dayofweek">
          <span class="font-38">{{ formatDate(date) }}</span>
        </a>
      </li>
    </ul>
    <div>
      <v-row>
        <v-col cols="3" class="ml-6">
          <v-select
              v-model="selectedCinemaId"
              :items="cinemas"
              item-text="name"
              item-value="id"
              label="Chọn rạp"
              style="margin-bottom: 10px; margin-left: 1%; margin-right: 1%;"
              :menu-props="{ offsetY: true }"
          >
            <template v-slot:selection="data">
              {{ data.item.name }} - Cách đây: {{ data.item.distance }} km
            </template>
            <template v-slot:item="data">
              {{ data.item.name }} - Cách đây: {{ data.item.distance }} km
            </template>
          </v-select>
        </v-col>
      </v-row>
      <v-container fluid class="ml-3">
        <v-row v-for="movie in filteredMovies" :key="movie.id" class="mb-4">
          <v-col cols="3" sm="3">
            <MovieCardV2 :movie="movie" :genres="genres"/>
          </v-col>
          <v-col cols="9" sm="9">
            <div class="tab-content">
              <div v-for="cinema in filteredCinemas" :key="cinema.id">
                <div class="row">
                  <div class="col-md-16" style="margin-bottom:10px;margin-top:10px;">
                    <span class="font-lg ml-12 bold font-transform-uppercase">2D Lồng tiếng</span>
                  </div>
                  <div class="col-lg-2 col-md-2 col-sm-3 col-xs-5 text-center ml-9"
                       v-for="time in cinema.availableTimes"
                       :key="time">
                    <a style="width:100%" @click="openConfirmationModal(cinema, time)" class="btn default">
                      {{ time }}
                    </a>
                    <div class="font-smaller padding-top-5">{{ cinema.seats }} ghế trống</div>
                  </div>
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <v-dialog v-model="confirmationDialog" max-width="400">
      <v-card>
        <v-card-title class="headline">Xác nhận đặt vé</v-card-title>
        <v-card-text>
          Bạn có chắc chắn muốn đặt vé vào lúc {{ selectedTime }} không?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="confirmBooking">Xác nhận</v-btn>
          <v-btn color="red darken-1" text @click="closeConfirmationModal">Hủy</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import MovieCardV2 from "./MovieCard-v2.vue";

export default {
  components: { MovieCardV2 },
  data() {
    return {
      genres: [],
      filteredMovies: [],
      cinemas: [
        {
          id: 1, name: "Beta Thanh Xuân", lat: 20.998574, lng: 105.811295, distance: null, seats: 163,
          showtimes: {
            '2024-05-27': ['7:00', '18:45', '22:00'],
            '2024-05-28': ['16:00', '18:45', '20:45', '22:50']
          }
        },
        {
          id: 2, name: "Beta Mỹ Đình", lat: 21.028511, lng: 105.780197, distance: null, seats: 122,
          showtimes: {
            '2024-05-27': ['8:30', '10:45', '14:00'],
            '2024-05-28': ['14:50', '16:00', '18:45', '20:00']
          }
        },
        {
          id: 3, name: "Beta Giải Phóng", lat: 21.000028, lng: 105.839023, distance: null, seats: 130,
          showtimes: {
            '2024-05-27': ['8:00', '9:45', '11:00', '12:45'],
            '2024-05-28': ['14:30', '16:00']
          }
        },
        {
          id: 4, name: "Beta Văn Quán", lat: 20.959556, lng: 105.778777, distance: null, seats: 134,
          showtimes: {
            '2024-05-27': ['16:00', '18:45', '20:00'],
            '2024-05-28': ['10:45', '16:50']
          }
        }
      ],
      currentPosition: { lat: null, lng: null },
      selectedCinemaId: 1, // Default selected cinema
      availableDates: this.getNextWeekDates(),
      selectedDate: this.getDefaultDate(), // Default selected date
      confirmationDialog: false,
      selectedCinema: {},
      selectedTime: ''
    };
  },
  computed: {
    filteredCinemas() {
      return this.cinemas.filter(cinema => cinema.id === this.selectedCinemaId)
          .map(cinema => {
            return {
              ...cinema,
              availableTimes: cinema.showtimes[this.selectedDate] || []
            };
          });
    }
  },
  methods: {
    async fetchMovies() {
      try {
        const response = await this.$http.get("/movie/popular");
        this.movies = response.data.results;
        this.filteredMovies = this.movies.slice(0, 3);
      } catch (error) {
        console.log(error);
      }
    },
    getCurrentPosition() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
              this.currentPosition.lat = position.coords.latitude;
              this.currentPosition.lng = position.coords.longitude;
              this.calculateDistances();
            },
            (error) => {
              console.error("Error getting location: ", error);
            }
        );
      } else {
        alert("Geolocation is not supported by this browser.");
      }
    },
    calculateDistances() {
      if (this.currentPosition.lat !== null && this.currentPosition.lng !== null) {
        this.cinemas.forEach((cinema) => {
          cinema.distance = this.getDistanceFromLatLonInKm(
              this.currentPosition.lat,
              this.currentPosition.lng,
              cinema.lat,
              cinema.lng
          ).toFixed(2);
        });
      }
    },
    getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
      const R = 6371; // Radius of the earth in km
      const dLat = this.deg2rad(lat2 - lat1);
      const dLon = this.deg2rad(lon1 - lon2);
      const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c; // Distance in km
      return distance;
    },
    deg2rad(deg) {
      return deg * (Math.PI / 180);
    },
    getDefaultDate() {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
      const dd = String(today.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    },
    getNextWeekDates() {
      const dates = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        dates.push(date.toISOString().split('T')[0]);
      }
      return dates;
    },
    formatDate(date) {
      const [year, month, day] = date.split('-');
      const dateObj = new Date(year, month - 1, day);
      const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
      return `${day}/${month} - ${dayNames[dateObj.getDay()]}`;
    },
    updateBooking(cinema) {
      if (cinema.selectedDate && cinema.selectedTime) {
        cinema.bookingDetails = {
          date: cinema.selectedDate,
          time: cinema.selectedTime,
        };
      }
    },
    selectCinema(cinema) {
      this.selectedCinemaId = cinema.id;
    },
    selectDate(date) {
      this.selectedDate = date;
    },
    openConfirmationModal(cinema, time) {
      this.selectedCinema = cinema;
      this.selectedTime = time;
      this.confirmationDialog = true;
    },
    closeConfirmationModal() {
      this.confirmationDialog = false;
    },
    confirmBooking() {
      this.confirmationDialog = false;
      // Redirect to seat selection page
      this.$router.push({ name: 'seat-selection', params: { cinemaId: this.selectedCinema.id, time: this.selectedTime } });
    }
  },
  mounted() {
    this.getCurrentPosition();
    this.fetchMovies();
  }
};
</script>

<style>
.modal-body {
  height: 430px;
  overflow-y: auto;
}

.nav-tabs {
  list-style: none;
  margin-bottom: 10px;
  margin-left: 1%;
  margin-right: 1%;
}

.nav-tabs .active a {
  font-weight: bold;
}

.tab-content {
  margin-top: 20px;
}

.row {
  display: flex;
  flex-wrap: wrap;
}

.col-md-16 {
  width: 100%;
}

.col-lg-2, .col-md-2, .col-sm-3, .col-xs-5 {
  width: 16.66%;
  margin-bottom: 10px;
}

.text-center {
  text-align: center;
}

.btn.default {
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #ccc;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.font-smaller {
  font-size: 0.9em;
  padding-top: 5px;
}

.font-lg {
  font-size: 1.2em;
}

.bold {
  font-weight: bold;
}

.font-transform-uppercase {
  text-transform: uppercase;
}

.font-38 {
  font-size: 1.5em;
}
</style>
