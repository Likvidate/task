<template>
  <!-- Container for the main components -->
  <div class="container">
    <!-- Side Component: Spin History -->
    <div class="side-component">
      <SpinHistory/>
    </div>

    <!-- Main Component: Roulette Game -->
    <div class="roulette-container">
      <RouletteComponent/>
    </div>

    <!-- Side Component: Last Spin Result -->
    <div class="side-component">
      <LastSpinResult/>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions } from 'vuex'
import RouletteComponent from '@/components/RouletteComponent.vue'
import LastSpinResult from '@/components/LastSpinResults.vue'
import SpinHistory from '@/components/SpinHistory.vue'

export default Vue.extend({
  components: {
    RouletteComponent,
    LastSpinResult,
    SpinHistory
  },
  created () {
    // Load base board configuration and next game data when the component is created
    this.loadBaseBoardConfiguration()
    this.loadNextGame()
  },
  methods: {
    ...mapActions(['loadBaseBoardConfiguration', 'loadNextGame'])
  }
})
</script>

<style scoped>
  /* Styling for the main container */
  .container {
    display: flex;
    justify-content: space-between;
    width: 100%;
    max-width: 100%;
  }

  /* Styling for the side components */
  .side-component {
    flex: 1;
    max-width: 25%;
  }

  /* Styling for the main roulette container */
  .roulette-container {
    flex: 2;
  }
</style>
