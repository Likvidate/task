import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

interface BaseBoardConfiguration {
  name: string
  slots: number
  results: string[]
  colors: string[]
  positionToId: number[]
}

interface RootState {
  apiUrl: string
  baseBoardConfiguration: BaseBoardConfiguration
}

const store = new Vuex.Store<RootState>({
  state: {
    apiUrl: 'https://dev-games-backend.advbet.com/v1/ab-roulette/1',
    baseBoardConfiguration: {
      name: '',
      slots: 0,
      results: [],
      colors: [],
      positionToId: []
    }
  },
  mutations: {
    setApiUrl (state, newApiUrl: string) {
      state.apiUrl = newApiUrl
      if (newApiUrl) {
        // Trigger the action to load base board configuration
        store.dispatch('loadBaseBoardConfiguration')
      }
    },
    setBaseBoardConfiguration (state, config: BaseBoardConfiguration) {
      state.baseBoardConfiguration = config
    }
  },
  actions: {
    /**
     * Fetches the base board configuration from the API.
     * @returns {Promise<BaseBoardConfiguration>} A promise that resolves to the base board configuration.
     * If the request fails or an error occurs, a default configuration is returned.
     * Loading board here because it doesn't need to be constantly updated like other data.
     */
    async loadBaseBoardConfiguration ({ commit, state }) {
      try {
        const response = await fetch(`${state.apiUrl}/configuration`)
        if (response.ok) {
          const data = await response.json() as BaseBoardConfiguration
          commit('setBaseBoardConfiguration', data)
        } else {
          console.error('Failed to fetch data')
        }
      } catch (error) {
        console.error('An error occurred:', error)
      }
    }
  }
})

export default store
