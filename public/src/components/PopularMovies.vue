<template>
  <div class="mx-3">
    <h2 class="mt-2 ml-3">Phim nổi bật</h2>
    <v-row class="ml-1 mr-1">
      <v-col cols="6" sm="3">
        <v-select
            v-model="selectedGenre"
            :items="genres"
            item-text="name"
            item-value="id"
            label="Chọn thể loại"
            @change="filterMovies"
            :menu-props="{ offsetY: true }"
        ></v-select>
      </v-col>
      <v-col cols="6" sm="3">
        <v-select
            v-model="selectedRating"
            :items="ratingOptions"
            item-text="label"
            item-value="value"
            label="Đánh giá tối thiểu"
            @change="filterMovies"
            :menu-props="{ offsetY: true }"
        ></v-select>
      </v-col>

    </v-row>
    <v-container fluid>
      <v-row>
        <v-col cols="12" sm="3" v-for="movie in filteredMovies" :key="movie.id">
          <MovieCard :movie="movie" :genres="genres" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import MovieCard from '../components/MovieCard'

export default {
  components: {
    MovieCard,
  },
  data: function () {
    return {
      movies: [],
      genres: [],
      selectedGenre: null,
      selectedRating: 0,
      filteredMovies: [],
      ratingOptions: [
        { label: '0 sao trở lên', value: 1 },
        { label: '1 sao trở lên', value: 2 },
        { label: '2 sao trở lên', value: 3 },
        { label: '3 sao trở lên', value: 4 },
        { label: '4 sao trở lên', value: 5 },
      ],
    };
  },
  async mounted() {
    this.fetchGenres();
    this.fetchMovies();
  },
  methods: {
    async fetchGenres() {
      try {
        const response = await this.$http.get("/genre/movie/list");
        this.genres = response.data.genres.map(genre => {
          switch (genre.name) {
            case 'Action':
              return { ...genre, name: 'Hành động' };
            case 'Adventure':
              return { ...genre, name: 'Phiêu lưu' };
            case 'Animation':
              return { ...genre, name: 'Hoạt hình' };
            case 'Comedy':
              return { ...genre, name: 'Hài' };
            case 'Crime':
              return { ...genre, name: 'Tội phạm' };
            case 'Documentary':
              return { ...genre, name: 'Tài liệu' };
            case 'Drama':
              return { ...genre, name: 'Chính kịch' };
            case 'Family':
              return { ...genre, name: 'Gia đình' };
            case 'Fantasy':
              return { ...genre, name: 'Giả tưởng' };
            case 'History':
              return { ...genre, name: 'Lịch sử' };
            case 'Horror':
              return { ...genre, name: 'Kinh dị' };
            case 'Music':
              return { ...genre, name: 'Âm nhạc' };
            case 'Mystery':
              return { ...genre, name: 'Bí ẩn' };
            case 'Romance':
              return { ...genre, name: 'Lãng mạn' };
            case 'Science Fiction':
              return { ...genre, name: 'Khoa học viễn tưởng' };
            case 'TV Movie':
              return { ...genre, name: 'Phim truyền hình' };
            case 'Thriller':
              return { ...genre, name: 'Giật gân' };
            case 'War':
              return { ...genre, name: 'Chiến tranh' };
            case 'Western':
              return { ...genre, name: 'Viễn Tây' };
            default:
              return genre;
          }
        });
      } catch (error) {
        console.log(error);
      }
    },
    async fetchMovies() {
      try {
        const response = await this.$http.get("/movie/popular");
        this.movies = response.data.results;
        this.filteredMovies = this.movies;
      } catch (error) {
        console.log(error);
      }
    },
    filterMovies() {
      this.filteredMovies = this.movies.filter(movie => {
        const matchesGenre = this.selectedGenre ? movie.genre_ids.includes(this.selectedGenre) : true;
        const matchesRating = movie.vote_average >= this.selectedRating * 2 - 2;
        return matchesGenre && matchesRating;
      });
    }
  }
}
</script>

<style>
v-select {
  max-height: 40vh;
  overflow-y: auto;
}
</style>
