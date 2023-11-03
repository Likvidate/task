<template>
  <div>
    <!-- Display the heading for the log entries -->
    <h2>Log Entries</h2>
    <div class="log-window">
      <ul class="log-list">
        <!-- Loop through log entries and display formatted log entries -->
        <li v-for="(log, index) in logs" :key="index">
          {{ formatLogEntry(log) }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

export default Vue.extend({
  computed: {
    ...mapState(['logs'])
  },
  methods: {
    /**
     * Format a log entry to display timestamp and message.
     * If the log is not in the expected format, display it as JSON.
     * @param {any} log - The log entry to format.
     * @returns {string} The formatted log entry.
     */
    formatLogEntry (log: unknown): string {
      if (log && typeof log === 'object' && 'timestamp' in log && 'message' in log) {
        const formattedLog = log as { timestamp: string, message: string }
        return `${formattedLog.timestamp} ${formattedLog.message}`
      } else {
        return JSON.stringify(log) // If it's not in the expected format, display as JSON
      }
    }
  }
})
</script>

<style scoped>
.log-window {
  background-color: #d3d3d3; /* Grey background color */
  padding: 10px;
  border: 1px solid #808080; /* Grey border */
  max-height: 700px; /* Add a maximum height to enable scrolling */
  overflow-y: auto; /* Enable vertical scrolling */
}

.log-list {
  list-style: none; /* Remove list bullet points */
  padding: 0;
}

.log-list li {
  margin-bottom: 5px; /* Add spacing between log entries */
  white-space: pre-wrap; /* Preserve line breaks and wrap text */
  font-family: monospace; /* Use monospace font for consistent formatting */
}
</style>
