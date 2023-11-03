<template>
  <!-- Main Container for the application -->
  <div>
    <!-- Top Navigation Bar -->
    <div class="top-navigation">
      <nav>
        <ul>
          <!-- Route links to navigate between Game Board and Statistics views -->
          <li><router-link to="/" class="button-link">Game Board</router-link></li>
          <li><router-link to="/statistic" class="button-link">Statistics</router-link></li>
        </ul>
      </nav>
    </div>

    <!-- Input for managing the API URL -->
    <div class="api-url-input">
      <input
        v-model="apiUrl"
        type="text"
        placeholder="Enter API URL (e.g., https://example.com/api)"
        class="input-field"
        @input="validateApiUrl"
      >
      <div class="error-message" v-if="apiUrlError">{{ apiUrlError }}</div>
    </div>

    <!-- Router view for rendering different application views based on routes -->
    <router-view/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data () {
    return {
      apiUrlError: '' as string
    }
  },
  computed: {
    /**
     * Computed property for managing the current API URL from the Vuex store.
     * @property {string} get - Gets the current API URL from the store.
     * @property {function} set - Sets a new API URL in the store.
     * @param {string} newApiUrl - The new API URL to be set.
     */
    apiUrl: {
      get () {
        return this.$store.state.apiUrl
      },
      set (newApiUrl) {
        this.$store.commit('setApiUrl', newApiUrl)
      }
    }
  },
  methods: {
    /**
     * Validates the API URL input.
     * @description This function checks if the provided input matches a valid URL pattern.
     * @returns {void}
     */
    validateApiUrl () {
      // Regular expression pattern to validate URLs
      const apiUrlPattern = /^(https?:\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/

      if (apiUrlPattern.test(this.apiUrl) || this.apiUrl === '') {
        this.apiUrlError = '' // Clear the error message if the URL is valid or empty
      } else {
        this.apiUrlError = 'Invalid API URL' // Display an error message for an invalid URL
      }
    }
  }
})
</script>

<style scoped>
/* Styling for the API URL input section */
.api-url-input {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  margin-top: 10px;
}

/* Styling for the input field */
.input-field {
  width: 30%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  margin-bottom: 5px;
}

/* Styling for error messages */
.error-message {
  color: #ff0000;
  font-size: 12px;
}

/* Styling for the top navigation bar */
.top-navigation {
  padding: 10px 0;
}

.top-navigation nav {
  display: flex;
  justify-content: center;
}

.top-navigation ul {
  list-style: none;
  padding: 0;
  display: flex;
}

.top-navigation li {
  margin: 0 10px;
}

/* Styling for the route link buttons */
.button-link {
  text-decoration: none;
  color: #fff;
  background-color: #007bff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.button-link:hover {
  background-color: #0056b3;
}
</style>
