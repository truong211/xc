<template>
  <div class="modal-body" style="height: 430px; overflow-y: auto;">
    <h1 class="text-center pull-left" style="width: 100%; margin-top: 0px;">Rạp Chiếu Phim</h1>
    <!-- Date Selection Tabs -->
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
        <v-col cols="9"></v-col>
      </v-row>
      <div class="tab-content">
        <div v-for="cinema in filteredCinemas" :key="cinema.id">
          <div class="row">
            <div class="col-md-16" style="margin-bottom:10px;margin-top:10px;">
              <span class="font-lg ml-12 bold font-transform-uppercase">2D Lồng tiếng</span>
            </div>
            <div class="col-lg-2 col-md-2 col-sm-3 col-xs-5 text-center ml-9" v-for="time in cinema.availableTimes"
                 :key="time">
              <a style="width:100%" @click="bookTicket(cinema, time)" class="btn default">
                {{ time }}
              </a>
              <div class="font-smaller padding-top-5">{{ cinema.seats }} ghế trống</div>
            </div>
          </div>
          <div>
            <label for="time">Chọn giờ: </label>
            <select v-model="cinema.selectedTime" @change="updateBooking(cinema)">
              <option v-for="time in cinema.availableTimes" :key="time" :value="time">
                {{ time }}
              </option>
            </select>
          </div>
          <div v-if="cinema.bookingDetails">
            <p>Ngày đặt vé: {{ cinema.bookingDetails.date }}</p>
            <p>Giờ đặt vé: {{ cinema.bookingDetails.time }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {

      cinemas: [
        {
          id: 1, name: "Beta Thanh Xuân", lat: 20.998574, lng: 105.811295, distance: null, seats: 163,
          selectedDate: this.getDefaultDate(), selectedTime: '16:00', bookingDetails: null,
          availableTimes: ['16:00', '18:45', '20:00', '20:45', '22:50']
        },
        {
          id: 2, name: "Beta Mỹ Đình", lat: 21.028511, lng: 105.780197, distance: null, seats: 122,
          selectedDate: this.getDefaultDate(), selectedTime: '16:00', bookingDetails: null,
          availableTimes: ['8:00', '9:45', '11:00', '12:45', '14:50','16:00', '18:45', '20:00', '20:45', '22:50']
        },
        {
          id: 3, name: "Beta Giải Phóng", lat: 21.000028, lng: 105.839023, distance: null, seats: 130,
          selectedDate: this.getDefaultDate(), selectedTime: '16:00', bookingDetails: null,
          availableTimes: ['8:00', '9:45', '11:00', '12:45', '14:50','16:00']
        },
        {
          id: 4, name: "Beta Văn Quán", lat: 20.959556, lng: 105.778777, distance: null, seats: 134,
          selectedDate: this.getDefaultDate(), selectedTime: '16:00', bookingDetails: null,
          availableTimes: ['16:00', '18:45', '20:00', '20:45', '22:50']
        }
      ],
      currentPosition: {lat: null, lng: null},
      selectedCinemaId: 1, // Default selected cinema
      availableDates: this.getNextWeekDates(),
      selectedDate: this.getDefaultDate() // Default selected date
    };
  },
  computed: {
    filteredCinemas() {
      return this.cinemas.filter(cinema => cinema.id === this.selectedCinemaId);
    }
  },
  methods: {
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
      const dLon = this.deg2rad(lon2 - lon1); // Corrected this line
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
    bookTicket(cinema, time) {
      cinema.selectedTime = time;
      this.updateBooking(cinema);
      alert(`Đặt vé thành công cho rạp ${cinema.name} vào lúc ${time}`);
    }
  },
  mounted() {
    this.getCurrentPosition();
  }
};
</script>

<style>


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
