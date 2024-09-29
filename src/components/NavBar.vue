<template>
  <nav>
    <!-- Uncomment if you need the system bar
    <v-system-bar app dark>
      <v-spacer></v-spacer>
      <v-icon>mdi-minus</v-icon>
      <v-icon>mdi-checkbox-blank-outline</v-icon>
      <v-icon>mdi-close</v-icon>
    </v-system-bar>
    -->
    <v-app-bar app color="white" dark>
      <img src="../Images/logoBate.png" height="100"/>

      <v-btn style="color: black" text class="ml-2" to="/">Phim</v-btn>
      <v-btn style="color: black" text class="ml-2" to="/actors">Diễn viên</v-btn>
      <v-btn style="color: black" text class="ml-2" to="/select-cinemas">Đặt vé</v-btn>
      <v-btn style="color: black" text class="ml-2">Thông tin</v-btn>
      <v-btn style="color: black" text class="ml-2">Liên hệ</v-btn>
      <v-spacer></v-spacer>
      <v-autocomplete
          v-model="search"
          :items="movies"
          item-text="title"
          item-value="id"
          clearable
          hide-no-data
          hide-selected
          color="black"
          label="Tìm kiếm"
          prepend-inner-icon="search"
          flat
          class="search-bar"
          id="search"
          style="margin-bottom: -20px"
      >
        <template v-slot:item="{ item }">
          <v-btn style="color:black;" text :to="`/movie/${item.id}`">{{ item.title }}</v-btn>
        </template>
      </v-autocomplete>
      <v-btn icon
       >
        <v-badge color="green" content="2" overlap>
          <v-icon color="black">far fa-bell</v-icon>
        </v-badge>
      </v-btn>
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <div
              v-bind="attrs"
              v-on="on"
              class="d-flex align-center"
          >
            <v-avatar size="38">
              <v-img src="../Images/angry.png"></v-img>
            </v-avatar>
          </div>
        </template>
        <v-list dense style="min-width: 300px !important">
          <v-list-item
              class="d-flex align-center"
          >
            <v-list-item-title class="ml-1"
            >Tài khoản</v-list-item-title
            >
          </v-list-item>
          <v-list-item class="d-flex align-center">
            <v-list-item-icon class="mx-0">
              <v-icon size="23">mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-title class="ml-1">{{ username ?? 'Phạm Phương Hùng' }}
              <v-icon style="cursor: pointer;" @click="setActionUpdateUser">mdi-pencil-outline</v-icon>
            </v-list-item-title>
          </v-list-item>
          <v-list-item
              class="d-flex align-center"
          >
            <v-list-item-icon class="mx-0">
              <v-icon size="23">mdi-cash</v-icon>
            </v-list-item-icon>
            <v-list-item-title class="ml-1"
            >Tài khoản chính:
            </v-list-item-title
            >
          </v-list-item>
          <v-divider class="primary"></v-divider>
          <v-list-item
              @click="toggleChangePass"
              class="d-flex align-center"
          >
            <v-list-item-icon class="mx-0">
              <v-icon size="23">mdi-lock-reset</v-icon>
            </v-list-item-icon>
            <v-list-item-title class="ml-1"
            >Đổi mật khẩu</v-list-item-title
            >
          </v-list-item>
          <v-list-item
              @click="logout"
              class="d-flex align-center"
          >
            <v-list-item-icon class="mx-0">
              <v-icon size="23">mdi-logout</v-icon>
            </v-list-item-icon>
            <v-list-item-title class="ml-1"
            >Đăng xuất</v-list-item-title
            >
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

  </nav>
</template>
<script>

export default {
  data: () => ({
    drawer: null,
    model: '',
    search: null,
    movies: [],
    showProfileMenu: false,
    username: 'Phạm Phương Hùng',
  }),
  mounted() {
    this.loadMovies();
  },
  methods: {
    setActionUpdateUser() {
    },
    toggleChangePass(){},
    logout(){},
    loadMovies: async function () {
      try {
        const response = await this.$http.get("/movie/popular");
        this.movies = response.data.results;
      } catch (error) {
        console.log(error);
      }
    }
  }
}
</script>
<style>
.v-select:not(.v-text-field--single-line):not(.v-text-field--outlined) .v-select__slot > input {
  align-self: flex-end;
  color: black; /* input text color */
}

.v-autocomplete .v-input__control .v-input__slot:before,
.v-autocomplete .v-input__control .v-input__slot:after {
  border-color: black !important; /* underline color */
}

.v-autocomplete .v-label {
  color: black !important; /* label color */
}

.v-autocomplete .v-input__icon--prepend .v-icon {
  color: black !important; /* icon color */
}

.v-autocomplete .v-menu__content .v-list-item__content .v-list-item__title {
  color: black !important; /* dropdown item text color */
}

.v-autocomplete .v-menu__content {
  background-color: white; /* dropdown background color */
}

.v-icon.v-icon {
  align-items: center;
  display: inline-flex;
  font-feature-settings: "liga";
  font-size: 24px;
  justify-content: center;
  letter-spacing: normal;
  line-height: 1;
  position: relative;
  text-indent: 0;
  transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1), visibility 0s;
  vertical-align: middle;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  color: black;
}

.v-text-field > .v-input__control > .v-input__slot:after {
  background-color: currentColor;
  border-color: currentColor;
  border-style: solid;
  border-width: thin 0 thin 0;
  transform: scaleX(0);
  color: black;
}

.v-icon.v-icon.v-icon--link {
  cursor: pointer;
  outline: none;
  color: black;
}

.v-application--is-ltr .v-text-field .v-label {
  transform-origin: top left;
  color: black;
}
</style>
