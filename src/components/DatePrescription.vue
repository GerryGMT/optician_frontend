<template>
  <v-data-table
    :headers="headers"
    :items="patients"
    :search="search"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-card-title>Prescription {{patientid}}</v-card-title>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="#3A8301" dark class="mb-2" v-bind="attrs" v-on="on">
              New Px
            </v-btn>
          </template>
          <v-card class="p-0">
            <v-toolbar app color="#3A8301" dark>
              <div class="d-flex align-center ma-2 px-4">
                <v-img
                  alt="Vuetify Logo"
                  class="shrink mr-2"
                  contain
                  src="../assets/logo.svg"
                  transition="scale-transition"
                  width="70"
                />
                <v-app-bar-title class="ma-5 px-15">New PX</v-app-bar-title>
              </div>
            </v-toolbar>
            <v-container>
              <v-row>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model="editedItem.oldpx"
                    label="PX"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red" text @click="close"> Cancel </v-btn>
              <v-btn color="#3A8301" rounded dark @click="save"> Save </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
  </v-data-table>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";
export default {
  data: () => ({
    search: "",
    dialog: false,
    headers: [
      {
        text: "DATE",
        align: "start",
        sortable: false,
        value: "date",
      },
      { text: "OLD PX", value: "px" },
    ],
    patients: [],
    //edit action
    editedIndex: -1,
    editedItem: {
      date: " ",
      oldpx: " ",
    },
    defaultItem: {
      date: " ",
      oldpx: " ",
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? "New Prescription Details"
        : "Edit Prescription Details";
    },
    ...mapGetters(["patientid"]),
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.loadPatient();
  },
  

  methods: {
    async loadPatient() {
      try {
        const response = await axios.get(`patient/${this.patientid}`);
        console.log(response.data);
        this.patients = response.data.prescription.reverse();
      } catch (error) {
        console.log(error);
      }
      setTimeout(this.loadPatients, 1000);
    },
    editItem(item) {
      this.editedIndex = this.patients.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.patients[this.editedIndex], this.editedItem);
      } else {
        this.patients.push(this.editedItem);
      }
      this.close();
    },
  },
};
</script>
