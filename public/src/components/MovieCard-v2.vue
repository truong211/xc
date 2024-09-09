<template>
    <v-card >
      <v-img :src="posterPath" alt="" class=""></v-img>
      <v-card-title class="subtitle-2">{{ movie.title }}</v-card-title>
      <v-card-text>
        <v-row align="center" class="mx-0">
          <v-rating :value="movie.vote_average / 2" color="amber" dense half-increments readonly size="14">
          </v-rating>
          <div class="grey--text ml-5">
            Đánh giá : {{ (movie.vote_average / 2).toFixed(1) }} sao
          </div>
        </v-row>
        <div class="grey--text mt-4">
          Ngày khởi chiếu:{{ movie.release_date }}
        </div>
        <div class=" subtitle-2">
          Thể loại:
          <span v-for="(genre, index) in movie.genre_ids" :key="genre">
                  {{ genreTypeName(genre, index) }}
              </span>
        </div>
      </v-card-text>
    </v-card>
</template>

<script>
export default {
  props: {
    movie: {
      required: true,
    },
    genres: {
      required: true,
    }
  },
  computed: {
    posterPath() {
      return "https://image.tmdb.org/t/p/w500/" + this.movie.poster_path
    }
  },
  methods: {
    genreTypeName(genraId, index) {

      for (const item of this.genres) {
        if (item.id == genraId) {
          if (this.movie.genre_ids.length - 1 == index) {
            return item.name;
          } else {
            return item.name + ",";
          }

        }
      }
    }
  }
}
</script>

<style>

</style>