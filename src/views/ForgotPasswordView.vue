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
                <h4 class="ml-8 mt-5 mb-5">Please check your email to reset password</h4>
            </v-card>
          </div>
        </v-flex>
      </v-layout>
    </div>
  </div>
</template>


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
