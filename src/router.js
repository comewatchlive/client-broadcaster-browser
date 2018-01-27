import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/pages/Login'
import Broadcast from '@/pages/Broadcast'
import Privacy from '@/pages/Privacy'
import Terms from '@/pages/Terms'
import Unauthorized from '@/pages/Unauthorized'
import NotFound from '@/pages/404'
import {store} from './store'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    { path: '/', name: 'Broadcast', component: Broadcast, meta: { auth: true } },
    { path: '/unauth', name: 'Unauthorized', component: Unauthorized },
    { path: '/login', name: 'Login', component: Login },
    { path: '/terms', name: 'Terms', component: Terms },
    { path: '/privacy', name: 'Privacy', component: Privacy },
    // catch all
    { path: '*', name: 'Not Found', component: NotFound }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.meta.auth) {
    store.dispatch('user/getAuth').then(() => {
      if (store.state.user.isLoggedIn) {
        if (store.state.user.roles.indexOf('broadcaster') > -1) next()
        else next('/unauth')
      } else next('/login')
    })
  } else {
    next()
  }
})

export default router
