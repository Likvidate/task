<template>
  <div>
    <!-- Display the time remaining until the next game -->
    <div class="timer">Time till next game: {{ formattedTime }} min</div>
    <!-- Display the last game result -->
    <div class="last-game-result">
      <span>Last Game Result:</span>
      <span>{{ lastGameResult }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

// Define a type for the store state
interface RootState {
  timer: number
  lastGame: {
    outcome: string
  }
}

export default Vue.extend({
  computed: {
    /**
     * Get the remaining time until the next game in seconds.
     * @returns {number} The remaining time in seconds.
     */
    timer (): number {
      return (this.$store.state as RootState).timer
    },
    /**
     * Format the remaining time as minutes and seconds.
     * @returns {string} The formatted time as "MM:SS".
     */
    formattedTime (): string {
      const minutes = Math.floor(this.timer / 60)
      const seconds = this.timer % 60
      return `${minutes}:${seconds.toString().padStart(2, '0')}`
    },
    /**
     * Get the outcome of the last game.
     * @returns {string} The outcome of the last game.
     */
    lastGameResult (): string {
      return (this.$store.state as RootState).lastGame.outcome
    }
  }
})
</script>

<style scoped>
.timer {
  font-size: 18px;
  color: #333;
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
}

.last-game-result {
  font-size: 16px;
  color: #777;
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.last-game-result span {
  font-weight: bold;
  margin-right: 5px;
}
</style>
