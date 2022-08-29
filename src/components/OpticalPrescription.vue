<template>
  <v-data-table
    :headers="headers"
    :items="patients"
    :search="search"
    class="elevation-1 mt-3"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-card-title>Optical</v-card-title>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="#006A89" dark class="mb-2" v-bind="attrs" v-on="on">
              New Optical
            </v-btn>
          </template>
          <v-card class="p-0">
            <v-toolbar app color="#006A89" dark>
              <div class="d-flex align-center ma-2 px-4">
                <v-img
                  alt="Vuetify Logo"
                  class="shrink mr-2"
                  contain
                  src="../assets/logo.svg"
                  transition="scale-transition"
                  width="70"
                />
                <v-app-bar-title class="ma-5 px-15"
                  >New Optical</v-app-bar-title
                >
              </div>
            </v-toolbar>
            <v-container>
              <v-row>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model="editedItem.date"
                    label="Date"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model="editedItem.sph"
                    label="Sph"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model="editedItem.cyl"
                    label="Cyl"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model="editedItem.axis"
                    label="Axis"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model="editedItem.va"
                    label="Va"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model="editedItem.add"
                    label="Add"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red" text @click="close"> Cancel </v-btn>
              <v-btn color="#006A89" rounded dark @click="save"> Save </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
  </v-data-table>
</template>

<script>
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
      { text: "SPH", value: "sph" },
      { text: "CYL", value: "cyl" },
      { text: "AXIS", value: "axis" },
      { text: "V/A", value: "va" },
      { text: "ADD", value: "add" },
    ],
    patients: [],
    //edit action
    editedIndex: -1,
    editedItem: {
      date: " ",
      oldpx: 1,
      sph: 0,
      cyl: 0,
      axis: 0,
      va: 0,
    },
    defaultItem: {
      date: " ",
      oldpx: 1,
      sph: 0,
      cyl: 0,
      axis: 0,
      va: 0,
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? "New Prescription Details"
        : "Edit Prescription Details";
    },
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
    this.initialize();
  },

  methods: {
    initialize() {
      this.patients = [
        {
          date: " ",
          oldpx: 1,
          sph: 0,
          cyl: 0,
          axis: 0,
          va: 0,
        },
      ];
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
