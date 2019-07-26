import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  routes: [
      {
        path: '/',
        name: 'home',
        component: Home
      },
      {
        path: '/archive',
        name: 'archive',
        component: () => import(/* webpackChunkName: "archive" */ './views/Archive.vue')
      },
      {
        path: '/help',
        name: 'help',
        component: () => import(/* webpackChunkName: "help" */ './views/Help.vue')
      }
  ]
})
