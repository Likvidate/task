<template>
  <div class="roulette-container">
    <!-- Roulette wheel container -->
    <div class="roulette-wheel">
      <!-- Arrow shape -->
      <div class="arrow-shape">
        <!-- Arrow character, can be replaced with an image or symbol -->
        &#9654;
      </div>
      <!-- Roulette wheel -->
      <div class="wheel">
        <!-- Loop through roulette results and create slots -->
        <div
          v-for="(result, index) in rouletteConfig.results"
          :key="index"
          class="slot"
          :style="slotStyle(index)"
        >
          {{ result }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

// Define the structure of the Roulette Configuration
interface RouletteConfig {
  results: string[]
  colors: string[]
}

export default Vue.extend({
  data () {
    return {
      rotation: 0 // Initial rotation angle of the wheel
    } as {
      rotation: number
    }
  },
  computed: {
    // Retrieve Roulette Configuration from the store
    rouletteConfig (): RouletteConfig {
      return this.$store.state.baseBoardConfiguration
    },
    // Get the current game result
    currentGame (): string {
      return this.$store.state.currentGame
    }
  },
  watch: {
    currentGame: {
      handler (newGameResult) {
        // Start spinning the wheel when a new game result is received
        this.spinWheel(newGameResult.outcome)
      },
      deep: true
    }
  },
  methods: {
    /**
     * Calculate the style for each slot based on its index.
     * @param {number} index - The index of the slot.
     * @returns {object} An object with CSS styles for the slot.
     */
    slotStyle (index: number) {
      const slotAngle = 360 / this.rouletteConfig.results.length
      const rotate = `rotate(${index * slotAngle + this.rotation}deg)`

      // Adjusting the radius and spacing between slots
      const radius = '250px'

      // Determine text color based on background color
      const textColor = this.rouletteConfig.colors[index] === 'black' ? 'white' : 'black'

      return {
        background: this.rouletteConfig.colors[index],
        width: '40px',
        height: '40px',
        transform: `${rotate} translate(${radius})`,
        borderRadius: '50%',
        color: textColor
      }
    },
    /**
     * Spin the roulette wheel to the desired result.
     * @param {string} desiredResult - The desired roulette wheel result.
     */
    spinWheel (desiredResult: string) {
      const totalRotation = 10 * 360 // Total rotation angle for spinning
      const duration = 2000 // 2 seconds for the animation
      let startTime = 0

      if (!desiredResult || !this.rouletteConfig.results.includes(desiredResult)) {
        // Invalid or missing desired result, stop spinning
        return
      }

      const index = this.rouletteConfig.results.indexOf(desiredResult)
      const slotAngle = 360 / this.rouletteConfig.results.length
      const desiredRotation = totalRotation - (index * slotAngle + slotAngle / 2)

      const animate = (timestamp: number) => {
        if (!startTime) {
          startTime = timestamp
        }
        const elapsedTime = timestamp - startTime
        const progress = Math.min(elapsedTime / duration, 1)

        // Update the rotation angle based on animation progress
        this.rotation = progress * desiredRotation

        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          // Animation is complete
        }
      }

      // Start the animation loop
      requestAnimationFrame(animate)
    }
  }
})
</script>

<style scoped>
.roulette-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 70vh;
}

.roulette-wheel {
  display: flex;
  position: relative;
}

.arrow-shape {
  position: absolute;
  left: 300px;
  top: 35%;
  transform: translate(-50%, -50%) rotate(180deg);
  font-size: 24px;
}

.wheel {
  position: relative;
  width: 80%; /* Adjust the width percentage to your preference */
  padding-bottom: 80%; /* Maintain a square aspect ratio (1:1) for the wheel */
}

.slot {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
  position: absolute;
  transition: transform 5s ease; /* Smoothly transition slot rotations */
  width: 10%; /* Adjust the width percentage to your preference */
  height: 10%; /* Adjust the height percentage to your preference */
}
</style>
