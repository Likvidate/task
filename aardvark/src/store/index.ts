import Vue from 'vue'
import Vuex, { StoreOptions } from 'vuex'

Vue.use(Vuex)

interface RootState {
  apiUrl: string
}

const store = new Vuex.Store<RootState>({
  state: {
    apiUrl: 'https://dev-games-backend.advbet.com/v1/ab-roulette/1'
  },
  mutations: {
    setApiUrl (state, newApiUrl: string) {
      state.apiUrl = newApiUrl
    }
  }
})

export default store
