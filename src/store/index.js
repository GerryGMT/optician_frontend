import Vue from 'vue'
import Vuex from 'vuex'
import Localbase from 'localbase'
// import axios from 'axios'

let db = new Localbase('db')

Vue.use(Vuex)

const state = {
    user: null,
    patientid: []
}

export default new Vuex.Store({
  state,
  getters: {
    user: (state) => {
      return state.user;
    },
    patientid: (state) => {
      return state.patientid;
    }
  },
  mutations: {
    user(state, user) {
      state.user = user
    },
    patient(state, patientid) {
      state.patientid = patientid
    },
  },
  actions: {
    user(context, user) {
      db.delete().then(() => {
        db.collection('users').add(user).then(() => {
          context.commit('user', user);
        })
      })
    },
    patient(context, patientid) {
      context.commit('patient', patientid);
    },
    getUser({ commit }) {
      db.collection('users').get().then(user => {
        commit('user', user[0]);
      })
    },
    deleteUser({ commit }) {
      db.delete().then(() => {
        commit('user', null);
      })
    },
  },
  modules: {
  }
})
