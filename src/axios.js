import axios from 'axios'

axios.defaults.baseURL = 'https://crowded-jumpsuit-yak.cyclic.app/';
axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');