<template>
  <div class="home">
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

      <v-spacer></v-spacer>
      

      <v-btn
        text
        @click="handleClick"
      >
        <span class="mr-2">LogOut</span>
      </v-btn>
    </v-app-bar>
    <crud-action />
  </div>
</template>

<script>
import CrudAction from "../components/CrudAction.vue";

export default {
  name: "Home",
  components: {
    CrudAction,
  },
  methods: {
    handleClick() {
      this.$store.dispatch('deleteUser')
      localStorage.removeItem('token');
      this.$router.push('/')
    },
  }
};
</script>

