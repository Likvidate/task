<template>
  <div class="roulette-container">
    <div class="roulette-wheel">
      <div class="arrow-shape">
        &#9654;
      </div>
      <div class="wheel">
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
    <button @click="spinWheel" class="spin-button" :disabled="spinning">Spin</button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

interface RouletteConfig {
  results: string[]
  colors: string[]
}

export default Vue.extend({
  data () {
    return {
      spinning: false,
      rotation: 0,
      desiredResult: '30'
    } as {
      spinning: boolean
      rotation: number
      desiredResult: string
    }
  },
  computed: {
    rouletteConfig (): RouletteConfig {
      return this.$store.state.baseBoardConfiguration
    }
  },
  methods: {
    spinWheel () {
      if (!this.spinning) {
        this.spinning = true
        const totalRotation = 10 * 360
        const duration = 5000

        if (!this.desiredResult || !this.rouletteConfig.results.includes(this.desiredResult)) {
          // Invalid or missing desired result
          this.spinning = false
          return
        }

        const index = this.rouletteConfig.results.indexOf(this.desiredResult)
        const slotAngle = 360 / this.rouletteConfig.results.length
        const desiredRotation = totalRotation - (index * slotAngle + slotAngle / 2)

        const interval = 100
        const step = (totalRotation * interval) / duration
        const stepCount = Math.ceil(desiredRotation / step)

        let currentRotation = 0
        let steps = 0

        const spinInterval = setInterval(() => {
          currentRotation += step
          this.rotation = currentRotation

          if (steps >= stepCount) {
            clearInterval(spinInterval)
            this.rotation = desiredRotation
            this.spinning = false
          }
          steps++
        }, interval)
      }
    },
    slotStyle (index: number) {
      const slotAngle = 360 / this.rouletteConfig.results.length
      const rotate = `rotate(${index * slotAngle + this.rotation}deg)`

      // Adjusting the radius and spacing between slots
      const radius = '250px'

      const textColor = this.rouletteConfig.colors[index] === 'black' ? 'white' : 'black' // Change the text color

      return {
        background: this.rouletteConfig.colors[index],
        width: '40px', // Fixed width
        height: '40px', // Fixed height
        transform: `${rotate} translate(${radius})`,
        borderRadius: '50%', // Ensures the slot is circular
        color: textColor // Set the text color
      }
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
    height: 100vh;
  }

  .roulette-wheel {
    display: flex;
    position: relative;
  }

  .arrow-shape {
    position: absolute;
    left: 300px; /* Adjust the left property to move the arrow closer to the wheel */
    top: 35%;
    transform: translate(-50%, -50%) rotate(180deg);
    font-size: 24px;
  }

  .wheel {
    position: relative;
  }

  /* Add styling for slot elements as needed */
  .slot {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    user-select: none;
    position: absolute;
    transition: transform 5s ease;
  }

  .spin-button {
    margin-top: 20px;
  }
</style>
