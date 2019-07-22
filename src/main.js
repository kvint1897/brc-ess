import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VModal from 'vue-js-modal'

Vue.config.productionTip = false

Vue.use(VModal)

new Vue({
  created() {
    this.$store.dispatch('fetchConfig')
  },
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
