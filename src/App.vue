<template>
  <v-app>
    <!-- Kiểm tra route name -->
    <NavBar v-if="$route.name !== 'login'" />
    <Slideshow v-if="$route.name !== 'login'" />
    <v-main>
      <router-view/>
    </v-main>
    <v-divider v-if="$route.name !== 'login'"></v-divider>
    <Footer v-if="$route.name !== 'login'" />
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
  }
};
</script>
