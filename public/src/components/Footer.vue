<template>
  <v-footer
      dark
      padless
  >
    <v-card
        flat
        tile
        class=" white white--text text-center"
    >
      <v-card-text>
        <v-btn
            v-for="icon in icons"
            :key="icon"
            class="mx-4 white--text"
            icon
        >
          <v-icon size="24px" style="color: black">
            {{ icon }}
          </v-icon>
        </v-btn>
      </v-card-text>

      <v-card-text class="black--text pt-0">
        Chào mừng bạn đến với trang đặt vé xem phim của chúng tôi, nơi những bộ phim tuyệt vời đang chờ đón bạn! Khám phá thế giới điện ảnh cùng chúng tôi và tận hưởng những trải nghiệm xem phim đỉnh cao.
        Đặt vé ngay hôm nay để không bỏ lỡ bất kỳ siêu phẩm nào tại rạp chiếu phim của chúng tôi!
      </v-card-text>

      <v-divider></v-divider>

      <v-card-text class="black--text">
        {{ new Date().getFullYear() }} — <strong>Bate Cineplex</strong>
      </v-card-text>
    </v-card>
  </v-footer>
</template>

<script>
export default {
  data: () => ({
    icons: [
      'mdi-facebook',
      'mdi-twitter',
      'mdi-linkedin',
      'mdi-instagram'
    ]
  })
}
</script>

<style>

</style>