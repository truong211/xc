<template>
   <div>
     <PopularMovies />
     <UpcomingMovies />
   </div>
</template>

<script>

import PopularMovies from '../components/PopularMovies.vue'
import UpcomingMovies from '../components/UpcomingMovies.vue'
  export default {
    name: 'Home',
    head: {
      title: 'Trang chủ'
    },
    components: {
    PopularMovies,
    UpcomingMovies
    }


  }
</script>
