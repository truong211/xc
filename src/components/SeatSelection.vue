<template>
  <div>
    <h1 class="text-center">Chọn chỗ ngồi</h1>
    <div class="cinema-info">
      <p>Rạp: {{ cinemaName }}</p>
      <p>Giờ chiếu: {{ showtime }}</p>
    </div>
    <div class="seat-legend">
      <v-btn color="grey" class="seat-btn"></v-btn>
      Ghế thường (60,000 VND)
      <v-btn color="blue" class="seat-btn ml-12"></v-btn>
      Ghế VIP (75,000 VND)
      <v-btn color="red" class="seat-btn ml-12"></v-btn>
      Ghế đã chọn
    </div>
    <v-row>
      <v-col cols="9">
        <div class="seat-selection">
          <v-row v-for="(row, rowIndex) in seats" :key="rowIndex" class="seat-row">
            <v-col cols="auto">{{ row[0].price.toLocaleString() }} VND</v-col>
            <v-col v-for="seat in row" :key="seat.number" class="seat-col">
              <v-btn
                  :color="seat.selected ? 'red' : seat.color"
                  @click="selectSeat(rowIndex, seat.number)"
                  class="seat-btn"
              >
                {{ seat.label }}
              </v-btn>
            </v-col>
          </v-row>
        </div>
      </v-col>
      <v-col cols="3">
        <div class="seat-info">
          <p>Ghế đã chọn: {{ selectedSeats.map(seat => seat.label).join(', ') }}</p>
          <p>Tổng tiền: {{ totalPrice.toLocaleString() }} VND</p>
        </div>
        <v-btn color="green" @click="confirmSeats">Xác nhận</v-btn>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title class="headline">Xác nhận thành công</v-card-title>
        <v-card-text>
          <div>
            <strong>Ghế đã chọn:</strong> {{ selectedSeats.map(seat => seat.label).join(', ') }}
          </div>
          <div>
            <strong>Tổng tiền:</strong> {{ totalPrice.toLocaleString() }} VND
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="redirectToHome">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cinemaName: '',
      showtime: '',
      seats: this.generateSeats(),
      selectedSeats: [],
      dialog: false
    };
  },
  methods: {
    generateSeats() {
      const rows = [];
      const seatColors = ['grey', 'grey', 'grey', 'grey', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue'];
      const rowLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];
      for (let i = 0; i < 11; i++) {
        const row = [];
        for (let j = 1; j <= 11; j++) {
          row.push({
            number: j,
            label: `${rowLabels[i]}${j}`,
            color: seatColors[i],
            price: i < 4 ? 60000 : 75000,
            selected: false
          });
        }
        rows.push(row);
      }
      return rows;
    },
    selectSeat(rowIndex, seatNumber) {
      const row = this.seats[rowIndex];
      const seat = row.find(s => s.number === seatNumber);
      if (!seat.selected && this.isSeatAlreadyBooked(seat.label)) {
        alert(`Ghế ${seat.label} đã được chọn trước đó. Vui lòng chọn ghế khác.`);
        return;
      }
      seat.selected = !seat.selected;
      if (seat.selected) {
        this.selectedSeats.push(seat);
      } else {
        this.selectedSeats = this.selectedSeats.filter(s => s.label !== seat.label);
      }
      this.saveSelectedSeats();
    },
    saveSelectedSeats() {
      const selectedSeats = this.selectedSeats.map(seat => seat.label);
      localStorage.setItem(`selectedSeats_${this.cinemaName}_${this.showtime}`, JSON.stringify(selectedSeats));
    },
    loadSelectedSeats() {
      const selectedSeats = JSON.parse(localStorage.getItem(`selectedSeats_${this.cinemaName}_${this.showtime}`)) || [];
      selectedSeats.forEach(seatLabel => {
        this.seats.forEach(row => {
          const seat = row.find(s => s.label === seatLabel);
          if (seat) seat.selected = true;
        });
      });
      this.selectedSeats = selectedSeats.map(label => {
        for (let row of this.seats) {
          const seat = row.find(s => s.label === label);
          if (seat) return seat;
        }
      });
    },
    isSeatAlreadyBooked(seatLabel) {
      const selectedSeats = JSON.parse(localStorage.getItem(`selectedSeats_${this.cinemaName}_${this.showtime}`)) || [];
      return selectedSeats.includes(seatLabel);
    },
    confirmSeats() {
      this.dialog = true;
    },
    redirectToHome() {
      this.dialog = false;
      this.$router.push('/');
    }
  },
  computed: {
    totalPrice() {
      return this.selectedSeats.reduce((total, seat) => total + seat.price, 0);
    }
  },
  created() {
    this.cinemaName = this.$route.params.cinemaId;
    this.showtime = this.$route.params.time;
    this.loadSelectedSeats();
  }
};
</script>

<style>
.cinema-info {
  margin-bottom: 20px;
}

.seat-legend {
  margin-bottom: 20px;
  text-align: center;
}

.seat-legend p {
  display: flex;
  align-items: center;
}

.seat-legend .seat-btn {
  margin-right: 10px;
}

.seat-selection {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.seat-row {
  display: flex;
  align-items: center;
}

.seat-col {
  margin: 1px;
}

.seat-btn {
  width: 40px;
  height: 40px;
}

.seat-info {
  margin-top: 20px;
}

.v-card-text div {
  margin-bottom: 10px;
  font-size: 16px;
}

.v-card-text strong {
  font-weight: bold;
}

.col-9 {
  padding: 30px;
}
</style>
