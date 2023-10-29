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
    async loadBaseBoardConfiguration (): Promise<BaseBoardConfiguration> {
      try {
        const response = await fetch(`${this.apiUrl}/configuration`)
        console.log(response)
        if (response.ok) {
          const data = await response.json()
          console.log(data)
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
