<template>
  <v-card class="ma-3" elevation="0">
    <v-card-title>
      Welcome Optician, {{ user.fullname.split(" ").slice(0, -1).join(" ") }}
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <!-- Data Table -->
    <v-data-table
      :headers="headers"
      :items="patients"
      :search="search"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-spacer></v-spacer>
          <v-btn color="#04B18A" dark class="mb-2" @click.stop="dialog1 = true">
            New Patient
          </v-btn>

          <!-- Dialog1 EDIT patient -->
          <v-dialog v-model="dialog" max-width="500px">
            <v-card>
              <form v-on:submit.prevent="submitFormUpdate">
                <div>
                  <v-toolbar app color="#04B18A" dark>
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
                        >Prestige Eyecare</v-app-bar-title
                      >
                    </div>
                  </v-toolbar>
                  <v-card-title class="pa-3">
                    <span class="text-h6">Patient Edit</span>
                  </v-card-title>
                  <v-container>
                    <v-col cols="12" sm="12" md="3" lg="12" class="pa-1">
                      <v-text-field
                        outlined
                        v-model="editedItem.fullname"
                        label="Full Name"
                        append-icon="mdi-account"
                      ></v-text-field>
                    </v-col>

                    <!-- Birthday Date -->
                    <v-col cols="12" sm="12" md="3" lg="6" class="pa-1">
                      <div>
                        <div class="mb-6">
                          Birthday Date:
                          <code>{{ activePickerEdit || "null" }}</code>
                        </div>
                        <v-menu
                          ref="menu"
                          v-model="menu"
                          :close-on-content-click="false"
                          transition="scale-transition"
                          offset-y
                          min-width="auto"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              outlined
                              v-model="editedItem.dob"
                              label="Birthday date"
                              prepend-icon="mdi-calendar"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <!-- Date picker -->
                          <v-date-picker
                            color="#04B18A"
                            v-model="editedItem.dob"
                            :active-picker.sync="activePickerEdit"
                            :max="
                              new Date(
                                Date.now() -
                                  new Date().getTimezoneOffset() * 60000
                              )
                                .toISOString()
                                .substr(0, 10)
                            "
                            min="1950-01-01"
                            @change="saveDobNew"
                          ></v-date-picker>
                        </v-menu>
                      </div>
                    </v-col>
                    <!-- End of birthday -->

                    <!-- County -->
                    <v-col cols="12" sm="12" md="3" lg="12" class="pa-1">
                      <v-text-field
                        outlined
                        v-model="editedItem.address"
                        label="County"
                        append-icon="mdi-map-marker"
                      ></v-text-field>
                    </v-col>
                    <!-- Telephone -->
                    <v-col cols="12" sm="12" md="3" lg="12" class="pa-1">
                      <v-text-field
                        outlined
                        v-model="editedItem.phone"
                        label="Telephone"
                        append-icon="mdi-phone"
                      ></v-text-field>
                    </v-col>
                    <!-- Occupation -->
                    <v-col cols="12" sm="12" md="3" lg="12" class="pa-1">
                      <v-text-field
                        outlined
                        v-model="editedItem.occupation"
                        label="Occupation"
                        append-icon="mdi-briefcase"
                      ></v-text-field>
                    </v-col>
                    <!-- Alert -->
                    <v-alert v-if="alertError1" type="error">
                      Error! Please try again later!
                    </v-alert>
                    <v-alert v-if="alertSuccess1" type="success">
                      <v-row align="center">
                        <v-col class="grow">
                          Patient edited successfully!
                        </v-col>
                        <v-col class="shrink">
                          <v-btn
                            @click.stop="
                              (dialog = false), (alertSuccess1 = false)
                            "
                            text
                            >OK</v-btn
                          >
                        </v-col>
                      </v-row>
                    </v-alert>
                  </v-container>
                </div>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="red"
                    text
                    @click.stop="
                      (dialog = false),
                        (alertSuccess1 = false),
                        (alertError1 = false)
                    "
                  >
                    Cancel
                  </v-btn>
                  <v-btn rounded color="#04B18A" dark type="submit">
                    {{ isLoading }}
                  </v-btn>
                </v-card-actions>
              </form>
            </v-card>
          </v-dialog>

          <!-- Opens Patients Details Dialog -->
          <v-dialog
            v-model="view"
            fullscreen
            hide-overlay
            transition="dialog-bottom-transition"
          >
            <v-card>
              <v-toolbar dark color="#04B18A">
                <v-btn icon dark @click="view = false">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title>Patient Details</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                  <v-btn dark text @click="view = false"> Save </v-btn>
                </v-toolbar-items>
              </v-toolbar>

              <v-container>
                <date-prescription />
                <optical-prescription />
                <specs-prescription />
              </v-container>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <!-- view...for later-->
      <template v-slot:[`item.view`]="{ item }">
        <v-icon small class="mr-2" @click="viewItem(item)"> mdi-eye </v-icon>
      </template>
      <!-- Edit Action -->
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
      </template>
    </v-data-table>

    <!-- Add New Patient -->
    <v-dialog v-model="dialog1" max-width="500px">
      <v-card>
        <form v-on:submit.prevent="submitForm">
          <div>
            <v-toolbar app color="#04B18A" dark>
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
                  >Prestige Eyecare</v-app-bar-title
                >
              </div>
            </v-toolbar>
            <v-card-title class="pa-3">
              <span class="text-h6">Patient Add</span>
            </v-card-title>
            <v-container>
              <!-- Date start -->
              <v-col cols="12" sm="12" md="3" lg="6" class="pa-1">
                <v-dialog
                  ref="dialog"
                  v-model="modal"
                  :return-value.sync="date"
                  persistent
                  width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="date"
                      outlined
                      label="Date"
                      append-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker color="#04B18A" v-model="date" scrollable>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="modal = false">
                      Cancel
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.dialog.save(date)"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-dialog>
              </v-col>
              <!-- Date end -->

              <!-- Full Name -->
              <v-col cols="12" sm="12" md="3" lg="12" class="pa-1">
                <v-text-field
                  outlined
                  v-model="fullname"
                  label="Full Name"
                  append-icon="mdi-account"
                ></v-text-field>
              </v-col>

              <!-- Email -->
              <v-col cols="12" sm="12" md="3" lg="12" class="pa-1">
                <v-text-field
                  outlined
                  v-model="email"
                  label="Email"
                  append-icon="mdi-email"
                ></v-text-field>
              </v-col>

              <!-- Birthday Date -->
              <v-col cols="12" sm="12" md="3" lg="6" class="pa-1">
                <div>
                  <div class="mb-6">
                    Birthday Date: <code>{{ activePicker || "null" }}</code>
                  </div>
                  <v-menu
                    ref="menu"
                    v-model="menu2"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        outlined
                        v-model="newdob"
                        label="Birthday date"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      color="#04B18A"
                      v-model="newdob"
                      :active-picker.sync="activePicker"
                      :max="
                        new Date(
                          Date.now() - new Date().getTimezoneOffset() * 60000
                        )
                          .toISOString()
                          .substr(0, 10)
                      "
                      min="1950-01-01"
                      @change="savedob"
                    ></v-date-picker>
                  </v-menu>
                </div>
              </v-col>
              <!-- End of birth date -->

              <!-- County -->
              <v-col cols="12" sm="12" md="3" lg="12" class="pa-1">
                <v-text-field
                  outlined
                  v-model="newaddress"
                  label="County"
                  append-icon="mdi-map-marker"
                ></v-text-field>
              </v-col>
              <!-- Telephone -->
              <v-col cols="12" sm="12" md="3" lg="12" class="pa-1">
                <v-text-field
                  outlined
                  v-model="newphone"
                  label="Telephone"
                  append-icon="mdi-phone"
                ></v-text-field>
              </v-col>
              <!-- Occupation -->
              <v-col cols="12" sm="12" md="3" lg="12" class="pa-1">
                <v-text-field
                  outlined
                  v-model="newoccupation"
                  label="Occupation"
                  append-icon="mdi-briefcase"
                ></v-text-field>
              </v-col>
              <v-alert v-if="alertError" type="error">
                Error! Please try again later!
              </v-alert>
              <v-alert v-if="alertSuccess" type="success">
                <v-row align="center">
                  <v-col class="grow"> Patient added successfully! </v-col>
                  <v-col class="shrink">
                    <v-btn
                      @click.stop="(dialog1 = false), (alertSuccess = false)"
                      text
                      >OK</v-btn
                    >
                  </v-col>
                </v-row>
              </v-alert>
            </v-container>
          </div>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="red"
              text
              @click.stop="
                (dialog1 = false), (alertSuccess = false), (alertError = false)
              "
            >
              Cancel
            </v-btn>
            <v-btn rounded type="submit" color="#04B18A" dark>
              {{ isLoading }}
            </v-btn>
          </v-card-actions>
        </form>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import axios from "axios";
import DatePrescription from "./DatePrescription.vue";
import OpticalPrescription from "./OpticalPrescription.vue";
import SpecsPrescription from "./SpecsPrescription.vue";
import { mapGetters } from "vuex";
import { setTimeout } from "timers";
// import { setTimeout } from 'timers';
export default {
  components: { DatePrescription, OpticalPrescription, SpecsPrescription },
  data: () => ({
    search: "",
    dialog: false,
    dialog1: false,
    alertError: false,
    alertSuccess: false,
    alertError1: false,
    alertSuccess1: false,
    view: false,
    isLoading: "Submit",
    fullname: "",
    email: "",
    newdob: null,
    newaddress: "",
    newphone: "",
    newoccupation: "",
    userID: null,
    headers: [
      {
        text: "NAME",
        align: "start",
        sortable: false,
        value: "fullname",
      },
      {
        text: "EMAIL",
        sortable: false,
        value: "email",
      },
      { text: "COUNTY", value: "address" },
      { text: "OCCUPATION", value: "occupation" },
      { text: "DOB", value: "dob" },
      { text: "TELEPHONE", value: "phone" },
      { text: "EDIT", value: "actions", sortable: false },
    ],
    patients: [],
    //edit action
    editedIndex: -1,
    editedItem: {
      fullname: " ",
      email: " ",
      address: " ",
      occupation: " ",
      dob: " ",
      phone: " ",
    },
    defaultItem: {
      fullname: " ",
      email: " ",
      address: " ",
      occupation: " ",
      dob: " ",
      phone: " ",
    },
    //view
    viewedIndex: -1,
    viewedItem: {
      fullname: " ",
      email: " ",
      address: 0,
      occupation: 0,
      dob: 0,
      phone: 0,
    },

    //Choose Date
    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    menu: false,
    modal: false,
    modal2: false,
    menu2: false,
    activePicker: null,
    activePickerEdit: null,
    dob: null,
  }),

  watch: {
    menu(val) {
      val && setTimeout(() => (this.activePicker = "YEAR"));
    },
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.loadPatients();
  },

  computed: {
    ...mapGetters(["user"]),
  },

  mounted() {
    this.$store.dispatch("getUser");
  },

  methods: {
    savedob(date) {
      this.$refs.menu.save(date);
    },
    saveDobNew(date) {
      this.$refs.menu.save(date);
    },
    async loadPatients() {
      try {
        const response = await axios.get("patients");
        this.patients = response.data.reverse();
      } catch (error) {
        console.log(error);
      }
      setTimeout(this.loadPatients, 10000);
    },
    async submitForm() {
      this.isLoading = "Please wait...";
      try {
        const response = await axios.post("patient", {
          date: this.date,
          fullname: this.fullname,
          email: this.email,
          dob: this.newdob,
          address: this.newaddress,
          phone: this.newphone,
          occupation: this.newoccupation,
        });
        console.log(response);
        this.isLoading = "Submit";
        this.alertError = false;
        this.alertSuccess = true;
      } catch (e) {
        this.alertError = true;
        this.isLoading = "Submit";
      }
    },
    async submitFormUpdate() {
      this.isLoading = "Please wait...";
      try {
        const response = await axios.put(`patient/${this.userID}`, {
          fullname: this.editedItem.fullname,
          email: this.editedItem.email,
          dob: this.editedItem.dob,
          address: this.editedItem.address,
          phone: this.editedItem.phone,
          occupation: this.editedItem.occupation,
        });
        console.log(response);
        this.isLoading = "Submit";
        this.alertError = false;
        this.alertSuccess1 = true;
      } catch (e) {
        this.alertError1 = true;
        this.isLoading = "Submit";
      }
    },
    editItem(item) {
      this.editedIndex = this.patients.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.userID = this.editedItem._id;
      this.dialog = true;
    },

    viewItem(item) {
      this.viewedIndex = this.patients.indexOf(item);
      this.viewedItem = Object.assign({}, item);
      this.userID = this.viewedItem._id;
      console.log(this.userID);
      this.$store.dispatch("patient", this.userID);
      this.view = true;
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
