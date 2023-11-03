<template>
  <div>
    <!-- Display the title for Roulette Stats -->
    <h2>Roulette Stats</h2>
    <div class="container">
      <!-- Container for different stat categories -->
      <div class="column-container cold">
        <ul>
          <li v-for="(stat, index) in coldStats" :key="index">
            <!-- Display formatted stat information for the 'Cold' category -->
            <span class="stat-cube Cold" :style="{ backgroundColor: getColorForResult(stat.result) }">
              {{ formatStat(stat, 'Cold') }}
            </span>
          </li>
        </ul>
      </div>
      <div class="column-container neutral">
        <div class="neutral-columns">
          <div v-for="(column, columnIndex) in neutralColumns" :key="columnIndex" class="column">
            <ul>
              <li v-for="(stat, index) in column" :key="index">
                <!-- Display formatted stat information for the 'Neutral' category -->
                <span class="stat-cube Neutral" :style="{ backgroundColor: getColorForResult(stat.result) }">
                  {{ formatStat(stat, 'Neutral') }}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="column-container hot">
        <ul>
          <li v-for="(stat, index) in hotStats" :key="index">
            <!-- Display formatted stat information for the 'Hot' category -->
            <span class="stat-cube Hot" :style="{ backgroundColor: getColorForResult(stat.result) }">
              {{ formatStat(stat, 'Hot') }}
            </span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

// Define the type for your statistics data
interface StatData {
  result: number
  count: number
}

export default Vue.extend({
  computed: {
    ...mapState({
      apiUrl: (state: any) => state.apiUrl, // API URL
      baseBoardConfiguration: (state: any) => state.baseBoardConfiguration, // Configuration for the board
      stats: (state: any) => state.stats // Roulette statistics data
    }),

    // Computed property for 'Hot' statistics
    hotStats (): StatData[] {
      // Retrieve the last 5 stats as 'Hot' stats
      return this.stats.slice(-5)
    },

    // Computed property for 'Cold' statistics
    coldStats (): StatData[] {
      // Retrieve the first 5 stats as 'Cold' stats
      return this.stats.slice(0, 5)
    },

    // Computed property for 'Neutral' statistics
    neutralStats (): StatData[] {
      const hotStats = this.hotStats.map((stat) => stat.result)
      const coldStats = this.coldStats.map((stat) => stat.result)

      // Calculate 'Neutral' stats by filtering out 'Hot' and 'Cold' stats
      return this.stats.filter((stat: any) => {
        const result = stat.result
        return !hotStats.includes(result) && !coldStats.includes(result)
      })
    },

    // Computed property for distributing 'Neutral' stats into columns
    neutralColumns (): StatData[][] {
      const columns: StatData[][] = [[], [], []]
      const stats = this.neutralStats

      // Distribute 'Neutral' stats into three columns
      let col = 0
      for (let i = 0; i < stats.length; i++) {
        columns[col].push(stats[i])
        col = (col + 1) % 3
      }
      return columns
    }
  },
  methods: {
    /**
     * Format a statistic entry with category, result, and count.
     * @param stat - The statistic data.
     * @param category - The category (Cold, Neutral, Hot).
     * @returns The formatted statistic string.
     */
    formatStat (stat: StatData, category: string): string {
      return `${category}: ${stat.result} - ${stat.count}`
    },

    /**
     * Get the color for a specific result based on configuration.
     * @param result - The result number.
     * @returns The color string.
     */
    getColorForResult (result: number): string {
      const colorIndex = this.baseBoardConfiguration.results.indexOf(String(result))
      if (colorIndex !== -1) {
        return this.baseBoardConfiguration.colors[colorIndex]
      } else {
        return 'black' // Default color
      }
    }
  }
})
</script>

<style scoped>
  .container {
    display: flex;
    justify-content: space between;
  }

  .column-container {
    border-radius: 10px;
  }

  .column {
    padding: 0 5px;
    margin: 0;
  }

  .column-container li {
    margin-bottom: 20px;
  }

  .column-container.cold {
    background-color: lightblue;
  }

  .column-container.neutral {
    background-color: grey;
  }

  .column-container.hot {
    background-color: lightcoral;
  }

  .title {
    text-align: center;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  li {
    margin-bottom: 5px;
  }

  .stat-cube {
    display: inline-block;
    padding: 5px;
    margin: 5px;
    width: 160px;
    border: 1px solid #000;
    border-radius: 10px;
    text-align: center;
    font-weight: bold;
    color: white;
  }

  .stat-cube.Neutral {
    color: white;
    vertical-align: middle;
  }

  .stat-cube.Hot {
    background-color: #FF5722;
    margin-top: 20px;
  }

  .stat-cube.Cold {
    color: white;
    margin-top: 20px;
  }

  .neutral-columns {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin: 0 -5px;
  }

  .column {
    width: calc(33.33% - 20px);
    padding: 0 5px;
  }

  @media (max-width: 768px) {
    .column {
      width: 50%;
      padding: 0 5px;
    }
  }
</style>
