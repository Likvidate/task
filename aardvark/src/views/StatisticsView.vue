<template>
  <!-- Main Container for Log and Statistics Components -->
  <div class="container">
    <!-- Log Component: Display system logs -->
    <LogComponent/>

    <!-- Statistics Component: Display roulette game statistics -->
    <StatisticsComponent/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import LogComponent from '@/components/LogComponent.vue'
import StatisticsComponent from '@/components/StatisticsComponent.vue'

export default Vue.extend({
  components: {
    LogComponent,
    StatisticsComponent
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

  /* Styling for the child components within the container */
  .container > div {
    width: 50%;
  }

  /* Create a small gap between components by adding margin to the first child */
  .container > div:first-child {
    margin-right: 10px;
  }
</style>
