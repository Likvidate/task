import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// Define the state interface and other necessary interfaces
interface BaseBoardConfiguration {
  name: string // Name of the board configuration
  slots: number // Number of slots on the board
  results: string[] // List of possible results
  colors: string[] // Colors associated with each result
  positionToId: number[] // Mapping of positions to IDs
}

interface NextGame {
  uuid: string // UUID of the next game
  fakeStartDelta: number // Fake start delta for the next game
}

interface LastGame {
  id: string // ID of the last game
  outcome: string // Outcome of the last game
}

interface CurrentGame {
  id: string // ID of the current game
  outcome: string // Outcome of the current game
}

interface LogEntry {
  timestamp: string // Timestamp of the log entry
  message: string // Log message
}

interface Stat {
  result: number // Result value
  count: number // Count associated with the result
}

interface RootState {
  apiUrl: string // API URL
  baseBoardConfiguration: BaseBoardConfiguration
  nextGame: NextGame
  lastGame: LastGame
  currentGame: CurrentGame
  lastGames: LastGame[] // List of recent games
  timerIntervalId: any // Timer interval ID
  logs: LogEntry[] // Log entries
  stats: Stat[] // List of statistics
  timer: number // Timer property to store the countdown
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
    },
    nextGame: {
      uuid: '',
      fakeStartDelta: 0
    },
    lastGame: {
      id: '',
      outcome: ''
    },
    currentGame: {
      id: '',
      outcome: ''
    },
    lastGames: [],
    timerIntervalId: null, // Store the timer interval ID
    timer: 0, // Initialize the timer property
    logs: [],
    stats: []
  },
  mutations: {
    // Mutation to set the API URL
    setApiUrl (state, newApiUrl: string) {
      state.apiUrl = newApiUrl
      if (newApiUrl) {
        // Trigger the action to load base board configuration
        store.dispatch('loadNextGame')
        store.dispatch('loadBaseBoardConfiguration')
      }
    },
    // Mutation to set the base board configuration
    setBaseBoardConfiguration (state, config: BaseBoardConfiguration) {
      state.baseBoardConfiguration = config
    },
    // Mutation to set statistics data
    setStats (state, config: Stat[]) {
      state.stats = config
    },
    // Mutation to set the next game data
    setNextGame (state, data: NextGame) {
      state.nextGame = data
    },
    // Mutation to set the last game data
    setLastGame (state, data: LastGame) {
      state.lastGame = data
      if (data.outcome) {
        state.lastGames.unshift(data)
      }
    },
    // Mutation to set the current game data
    setCurrentGame (state, data: CurrentGame) {
      state.currentGame = data
    },
    // Mutation to update the timer property
    setTimer (state, value: number) {
      state.timer = value
    },
    // Mutation to clear the timer interval
    clearTimerInterval (state) {
      // Clear the timer interval when no longer needed
      if (state.timerIntervalId) {
        clearInterval(state.timerIntervalId)
        state.timerIntervalId = null
      }
    },
    // Mutation to set the timer interval ID
    setTimerIntervalId (state, intervalId) {
      state.timerIntervalId = intervalId
    },
    // Mutation to add a log entry
    addLogEntry (state, message: string) {
      const timestamp = getFormattedTimestamp()
      state.logs.push({ timestamp, message })
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
        store.dispatch('logAction', 'loading board configuration')
        store.dispatch('loadStats')
        const response = await fetch(`${state.apiUrl}/configuration`)
        if (response.ok) {
          const data = await response.json() as BaseBoardConfiguration
          commit('setBaseBoardConfiguration', data)
        } else {
          store.dispatch('logAction', 'failed to load board configuration')
        }
      } catch (error) {
        store.dispatch('logAction', 'error occurred when handling board configuration data')
      }
    },
    /**
     * Fetches the next game data from the API.
     * @returns {Promise<void>} A promise that resolves when the next game data is fetched.
     * If the request fails or an error occurs, appropriate log entries are added.
     */
    async loadNextGame ({ commit, state }) {
      try {
        store.dispatch('logAction', 'loading next game')
        const response = await fetch(`${state.apiUrl}/nextGame`)
        if (response.ok) {
          const data = await response.json() as NextGame
          commit('setNextGame', data)

          // Start the timer based on fakeStartDelta when nextGame data is loaded
          if (data.fakeStartDelta > 0) {
            store.dispatch('logAction', `next game will start in ${data.fakeStartDelta} s`)
            commit('setTimer', data.fakeStartDelta)

            // Clear the previous interval before setting a new one
            commit('clearTimerInterval')
            // Create a countdown timer that will dispatch an action when it's over
            const countdown = setInterval(() => {
              if (state.timer > 0) {
                commit('setTimer', state.timer - 1)
              } else {
                clearInterval(countdown) // Stop the timer
                // Dispatch an action when the timer is over
                store.dispatch('timerExpiredAction')
              }
            }, 1000) // Update every 1 second
            // Store the timer interval ID to clear it later
            commit('setTimerIntervalId', countdown)
          }
        } else {
          store.dispatch('logAction', 'failed to load next game')
          store.dispatch('timerNextGame')
        }
      } catch (error) {
        store.dispatch('logAction', 'error occurred when handling next game')
      }
    },
    /**
     * Action to be dispatched when the timer is over.
     * This action fetches game data for the current game and updates the necessary state.
     * @returns {Promise<void>} A promise that resolves after handling game data.
     * If the request fails or an error occurs, appropriate log entries are added.
     */
    async timerExpiredAction ({ commit, state }) {
      try {
        store.dispatch('logAction', `loading game data for game:  ${state.nextGame.uuid}`)
        const response = await fetch(`${state.apiUrl}/game/${state.nextGame.uuid}`)
        if (response.ok) {
          const data = await response.json() as LastGame
          commit('setCurrentGame', data)
          store.dispatch('loadNextGame')
        } else {
          store.dispatch('logAction', `failed to load game data for game:  ${state.nextGame.uuid}`)
        }
      } catch (error) {
        store.dispatch('logAction', `error occurred while handling data for game:  ${state.nextGame.uuid}`)
      } finally {
        setTimeout(() => {
          store.dispatch('logAction', `result for game ${state.currentGame.id} is ${state.currentGame.outcome}`)
          commit('setLastGame', state.currentGame)
          store.dispatch('loadStats')
        }, 10000)
      }
    },
    /**
     * Fetches statistics data from the API.
     * @returns {Promise<void>} A promise that resolves when the statistics data is fetched.
     * If the request fails or an error occurs, appropriate log entries are added.
     */
    async loadStats ({ commit, state }) {
      try {
        store.dispatch('logAction', 'loading statistics')
        const response = await fetch(`${state.apiUrl}/stats?limit=200`)
        if (response.ok) {
          const data = await response.json() as Stat[]
          commit('setStats', data)
        } else {
          store.dispatch('logAction', 'failed to load statistics')
        }
      } catch (error) {
        store.dispatch('logAction', 'error occurred when handling statistics data')
      }
    },
    /**
     * Adds a log entry to the logs state.
     * @param {string} message - The log message to be added.
     */
    logAction ({ commit }, message: string) {
      commit('addLogEntry', message)
    }
  }
})

/**
 * Gets the current timestamp in ISO format.
 * @returns {string} The current timestamp.
 */
function getFormattedTimestamp (): string {
  const now = new Date()
  return now.toISOString()
}

export default store
