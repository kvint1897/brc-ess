import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    config: null,
  },
  mutations: {
    updateConfig(state, config) {
      Vue.set(state, 'config', config);
    },
  },
  actions: {
    fetchConfig({ commit }) {
      let config = {
        apiUrl: 'http://web.kvint.md/brc/api.php',
        lengthCodes: 8,
        lengthSeries: 3,
      }
      if (localStorage.getItem('config')) {
        try {
          config = JSON.parse(localStorage.getItem('config'))
        } catch(e) {
          localStorage.removeItem('config');
        }
      }

      commit('updateConfig', config);
    },
    saveConfig({ state }) {
      localStorage.setItem('config', JSON.stringify(state.config))
    }
  }
})
