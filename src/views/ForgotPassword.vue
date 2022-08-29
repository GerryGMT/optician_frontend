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

    <div class="signin pa-1">
      <v-layout column class="mt-9">
        <v-flex>
          <div class="d-flex justify-center">
            <v-card class="form">
                <h3 class="ml-8 mt-5 mb-5">Forgot Password</h3>
              <div>
                <form class="ml-8 mr-8"
                v-on:submit.prevent="submitForm"
                >
                  <h4>Email Address</h4>
                  <v-text-field
                    v-model="email"
                    label="Enter Email"
                    required
                    outlined
                    :rules="[rules.required, rules.email]"
                  ></v-text-field>
                    <v-alert v-if="alertError" type="error">
                    Failed! Your email might be invalid!
                  </v-alert>
                  <v-btn type="submit" color="#04B18A" dark width="100%" class="mb-7"> {{isLoading}} </v-btn>
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
      email: '',
      alertError: false,
      show1: false,
      show2: true,
      isLoading: 'Forgot',
      show3: false,
      show4: false,
      res: null,
      rules: {
          required: value => !!value || 'Required.',
          email: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'Invalid e-mail.'
          },
        },
    }
  },
  methods: {
    async submitForm() {
        this.isLoading = 'Please wait...'
        try {
      const response = await axios.post('forgotPassword', {
        email: this.email,
      });
        this.res = response;
        this.isLoading = 'Forgot'
        this.$router.push('/forgotview')
      } catch (e) {
        this.alertError = true
        this.isLoading = 'Forgot'
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
  margin: 1rem;
  border-radius: 6px;
}
.form-1 {
  transform: translate(0px, -30px);
}
.text {
  text-align: center;
}
</style>
