<template>
  <v-app>
    <div class="background"></div>
    <v-main class="d-flex justify-center align-center">
      <v-col cols="10" lg="4" class="mx-auto">
        <v-card class="pa-4">
          <div class="text-center">
            <v-avatar size="100" color="indigo lighten-4">
              <v-img src="../Images/logo.jpg"></v-img>
            </v-avatar>
            <h2 class="indigo--text">Đăng nhập vào Bate Cinema</h2>
          </div>
          <v-form @submit.prevent="submitHandler" ref="form">
            <v-card-text>
              <v-text-field
                  v-model="email"
                  :rules="emailRules"
                  type="email"
                  label="Tên đăng nhập"
                  placeholder="Nhập tên đăng nhập"
                  prepend-inner-icon="mdi-account"
                  required
              />
              <v-text-field
                  v-model="password"
                  :rules="passwordRules"
                  :type="passwordShow?'text':'password'"
                  label="Mật khẩu"
                  placeholder="Nhập mật khẩu"
                  prepend-inner-icon="mdi-key"
                  :append-icon="passwordShow ? 'mdi-eye':'mdi-eye-off'"
                  @click:append="passwordShow = !passwordShow"
                  required
              />
              <span>Bạn chưa có tài khoản? bấm vào </span>
              <a href="https://www.themoviedb.org/signup" target="_blank">đăng ký</a>
              <span>  tài khoản ngay thôi!</span>
            </v-card-text>
            <v-card-actions class="justify-center">
              <v-btn :loading="loading" type="submit" color="indigo">
                <span class="white--text px-8">Đăng nhập</span>
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-main>
    <v-snackbar top color="green" v-model="snackbar">
      Login success
    </v-snackbar>
  </v-app>
</template>

<script>
export default {
  name: 'App',


  data: () => ({
    loading:false,
    snackbar:false,
    passwordShow:false,
    email: '',
    emailRules: [
      v => !!v || 'Tên đăng nhập không được bỏ trống',
    ],
    password: '',
    passwordRules: [
      v => !!v || 'Mật khẩu không được bỏ trống',
    ],
    requestToken: null,
  }),
  mounted() {
    this.getNewRequestToken()
  },
  methods:{
    async getNewRequestToken(){
      try{
        if(this.$cookies.get('request_token')){
          this.requestToken = this.$cookies.get('request_token')
          return
        }
        const response = await this.$http.get('authentication/token/new')
        if(response.status === 200){
          this.requestToken = response.data.request_token
          this.$cookies.set('request_token', this.requestToken)
        }
      }catch (e){
        console.log(e)
      }
    },
    submitHandler(){
      if (this.$refs.form.validate()){
        this.loading = true
        setTimeout(()=> {
          this.loading = false
          this.snackbar = true
        },3000)
      }
    }
  }
};
</script>
<style>
.background{
  background-image: url("../Images/loginBanner.jpg");
  height: 300px;
  width: 100%;
  display: block;
  position: absolute;
  top: 0;
  background-size: cover;
}
</style>