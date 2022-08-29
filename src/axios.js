import axios from 'axios'

axios.defaults.baseURL = 'https://prestige-opticians.herokuapp.com/';
axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');