<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    {{ baseBoardConfiguration }}
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

interface BaseBoardConfiguration {
  name: string
  slots: number
  results: string[]
  colors: string[]
  positionToId: number[]
}

export default Vue.extend({
  data () {
    return {
      baseBoardConfiguration: null as BaseBoardConfiguration | null
    }
  },
  computed: {
    /**
     * Computed property that gets the current API URL from the Vuex store.
     * @returns {string} The current API URL.
     */
    apiUrl: {
      get () {
        return this.$store.state.apiUrl
      }
    }
  },
  async created () {
    this.baseBoardConfiguration = await this.loadBaseBoardConfiguration()
  },
  methods: {
    /**
     * Fetches the base board configuration from the API.
     * @returns {Promise<BaseBoardConfiguration>} A promise that resolves to the base board configuration.
     * If the request fails or an error occurs, a default configuration is returned.
     * Loading board here because it doesn't need to be constantly updated like other data.
     */
    async loadBaseBoardConfiguration (): Promise<BaseBoardConfiguration> {
      try {
        const response = await fetch(`${this.apiUrl}/configuration`)
        if (response.ok) {
          const data = await response.json()
          return data
        } else {
          console.error('Failed to fetch data')
          return { name: '', slots: 0, results: [], colors: [], positionToId: [] }
        }
      } catch (error) {
        console.error('An error occurred:', error)
        throw error
      }
    }
  }
})
</script>
