<template>
  <div>
    <!-- Display the title for the played game table -->
    <div class="table-title">Played Game Table</div>
    <!-- Table for displaying played games -->
    <table class="played-game-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Result</th>
        </tr>
      </thead>
      <tbody>
        <!-- Loop through last games and create table rows -->
        <tr v-for="(game, index) in lastGames" :key="index">
          <td>{{ game.id }}</td>
          <td>{{ game.outcome }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

export default Vue.extend({
  computed: {
    // Map the 'lastGames' state from the store to a computed property
    ...mapState(['lastGames'])
  }
})
</script>

<style scoped>
.table-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.played-game-table {
  width: 100%;
  border-collapse: collapse;
}

.played-game-table th,
.played-game-table td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
}

.played-game-table th {
  background-color: #f0f0f0;
  font-weight: bold;
  color: #333;
}

/* Style for scrolling */
.played-game-table tbody {
  max-height: 300px; /* Adjust the maximum height as needed */
  overflow-y: auto;
}
</style>
