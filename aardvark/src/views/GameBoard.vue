<template>
  <div>
    {{ $store.state.baseBoardConfiguration }}
    <roulette-component/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions } from 'vuex'
import RouletteComponent from '@/components/RouletteComponent.vue'

export default Vue.extend({
  components: {
    RouletteComponent
  },
  data () {
    return {
    }
  },
  computed: {
    /**
     * Computed property that gets the current API URL from the Vuex store.
     * @returns {string} The current API URL.
     */
    apiUrl (): string {
      return this.$store.state.apiUrl
    },
    baseBoardConfiguration () {
      return this.$store.state.baseBoardConfiguration
    }
  },
  async created () {
    this.loadBaseBoardConfiguration()
  },
  methods: {
    ...mapActions(['loadBaseBoardConfiguration'])
  }
})
</script>
