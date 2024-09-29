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
    <v-snackbar top right color="green" v-model="loginSuccessfulSnackbar">
      Đăng nhập thành công!
    </v-snackbar>
    <v-snackbar top right color="red" v-model="loginFailedSnackbar">
      Đăng nhập thất bại
    </v-snackbar>
  </v-app>
</template>

<script>
export default {
  name: 'App',


  data: () => ({
    loading:false,
    loginSuccessfulSnackbar: false,
    loginFailedSnackbar: false,
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
    async createSession(){
      try {
        const response = await this.$http.post('authentication/session/new',{
          request_token: this.requestToken
        })
        if(response.status === 200 && response.data.success === true){
          this.$cookies.remove('request_token')
          this.$cookies.set('session_id', response.data.session_id)
          await this.getAccountID()
          await this.$router.push({name: 'Home'})
        }
      }
      catch (e){
        console.log(e)
      }
    },
    async getAccountID(){
      try{
        const response = await this.$http.get('account',{
          params:{
            session_id: this.$cookies.get('session_id')
          }
        })
        if(response.status === 200){
          this.$cookies.set('accountId', response.data.id)
        }
      }catch (e){
        console.log(e)
      }
    },
    async validateRequestToken(){
      try {
        if(!this.$cookies.get('request_token')){
          await this.getNewRequestToken()
        }
        const response = await this.$http.post('authentication/token/validate_with_login',{
          username: this.email,
          password: this.password,
          request_token: this.requestToken
        })
        if(response.status === 200 && response.data.success === true){
          await this.createSession()
          this.loginSuccessfulSnackbar = true
        }
      }
      catch (e){
        this.loginFailedSnackbar = true
      }
    },
    submitHandler(){
      if (this.$refs.form.validate()){
        this.loading = true
        this.validateRequestToken()
        setTimeout(()=> {
          this.loading = false
        },100)
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