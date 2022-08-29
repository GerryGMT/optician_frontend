<template>
  <div class="app">
    <v-app-bar app color="#04B18A" dark>
    <div class="d-flex align-center">
    <v-img
        alt="Vuetify Logo"
        class="shrink mr-2"
        contain
        src="../assets/logo.svg"
        transition="scale-transition"
        width="70"
    />
    <v-app-bar-title class="ma-0 pa-0 title">Prestige</v-app-bar-title>
    </div>

</v-app-bar>
    <div class="register pa-1">
      <v-layout column wrap class="mt-10">
        <v-flex xs10 md3>
          <div class="begin d-flex justify-center">
            <v-card class="form">
              <h3 class="ml-8 mt-5 mb-5">Reset Password</h3>
              <div>
                <form class="ml-8 mr-8"
                v-on:submit.prevent="submitForm"
                >
                  <h4 v-if="alertSuccessNot">Password</h4>
                  <v-text-field
                    v-if="alertSuccessNot"
                    v-model="password"
                    label="Password"
                    required
                    outlined
                    :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="passwordRules"
                    :type="show1 ? 'text' : 'password'"
                    name="input-10-1"
                    counter
                    @click:append="show1 = !show1"
                  ></v-text-field>
                  <h4 v-if="alertSuccessNot">Confirm Password</h4>
                  <v-text-field
                    v-if="alertSuccessNot"
                    v-model="confirmpassword"
                    label="Confirm Password"
                    required
                    outlined
                    :append-icon="show4 ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="confirmPasswordRules"
                    :type="show4 ? 'text' : 'password'"
                    name="input-10-2"
                    @click:append="show4 = !show4"
                  ></v-text-field>
                  <v-alert v-if="alertSuccess" type="success">
                  Success! Please check your email!
                  </v-alert>
                  <v-alert v-if="alertError" type="error">
                  Token is invalid or has expired!
                  </v-alert>
                  <v-btn v-if="alertSuccessNot" type="submit" class="mb-8" color="#04B18A" dark width="100%">
                    {{ isLoading }}
                  </v-btn>
                </form>
              </div>
            </v-card>
          </div>
        </v-flex>
      </v-layout>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      password: '',
      confirmpassword: '',
      status: false,
      formIsValid: true,
      isLoading: 'Reset',
      alertSuccess: false,
      alertSuccessNot: true,
      alertError: false,
      show1: false,
      show2: true,
      show3: false,
      show4: false,
      passwordRules: [
        (value) => !!value || 'Please type password.',
        (value) => (value && value.length >= 8) || 'Minimum 8 characters',
      ],
      confirmPasswordRules: [
        (value) => !!value || 'type confirm password',
        (value) =>
          value === this.password || 'The password confirmation does not match.',
      ],
    }
  },
  methods: {
  async submitForm() {
      this.isLoading = 'Please wait...'
      try {
      const response = await axios.patch('resetPassword', {
       password: this.password,
       token: this.$route.params.token
     });
     console.log(this.$route.params.token)
     console.log(response)
     this.isLoading = 'Reset'
     this.$router.push('/')
     } catch (e) {
        this.alertError = true
        this.isLoading = 'Reset'
      }
   }
  }
};
</script>

<style>
.form {
  height: auto;
  width: 400px;
  background-color: #fff;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;
  margin: 6px;
  border-radius: 6px;
}
.form-1 {
  transform: translate(0px, -30px);
}
</style>
