<template>
  <v-app>
    <NavBar />
    <Slideshow />
    <v-main>
      <router-view/>
    </v-main>
    <v-divider></v-divider>
    <Footer />
  </v-app>
</template>

<script>
import NavBar from './components/NavBar.vue';
import Footer from './components/Footer.vue';
import Slideshow from "@/components/Slideshow.vue";
export default {
  name: 'App',
  components: {
    NavBar,
    Slideshow,
    Footer
  },

  data: () => ({
    //
  }),
};
</script>
