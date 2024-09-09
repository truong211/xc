import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import MovieDetail from '../components/MovieDetail.vue'
import Actors from '../components/Actors.vue'
import ActorDetail from '../components/ActorDetail.vue'
import SelectCinemas from "../components/SelectCinemas.vue";
import SelectCinemasV2 from "../components/SelectCinemas-v2.vue";
import SeatSelection from "../components/SeatSelection.vue";
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path:"/movie/:id",
    name: 'Movie',
    component: MovieDetail
  },
  {
    path:"/movie/:id/select-cinemas",
    name: 'SelectCinemas',
    component: SelectCinemas
  },
  {
    path:"/select-cinemas",
    name: 'SelectCinemas-v2',
    component: SelectCinemasV2
  },
  {
    path:"/actors",
    name:"actors",
    component: Actors,
  },
  {
    path: "/actor/:id",
    name:"actor",
    component: ActorDetail
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/seat-selection',
    name: 'seat-selection',
    component: SeatSelection,

  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
