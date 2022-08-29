import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import SigninView from '../views/SignIn.vue'
import Forgot from '../views/ForgotPassword.vue'
import ForgotView from '../views/ForgotPasswordView.vue'
import ResetPassword from '../views/ResetPassword.vue'
import goTo from 'vuetify/es5/services/goto'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: "/",
    name: "signin",
    component: SigninView,
  },
  {
    path: "/forgot",
    name: "forgot",
    component: Forgot,
  },
  {
    path: "/forgotview",
    name: "forgotview",
    component: ForgotView,
  },
  {
    path: "/reset/:token",
    name: "reset",
    component: ResetPassword,
  },
  { path: "*", redirect: "/" }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  base: '/folder'
})

router.afterEach(() => {
  goTo(0, { duration: 0 })
})

export default router
