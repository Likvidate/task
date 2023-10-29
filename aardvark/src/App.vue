<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </nav>
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
    <router-view/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data () {
    return {
      apiUrl: '',
      apiUrlError: ''
    }
  },
  methods: {
    validateApiUrl () {
      // type definition on needed vue 2 RegExp is auto defined from regular expresion literal
      const apiUrlPattern = /^(https?:\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/

      if (apiUrlPattern.test(this.apiUrl) || this.apiUrl === '') {
        this.apiUrlError = ''
      } else {
        this.apiUrlError = 'Invalid API URL'
      }
    }
  }
})
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.api-url-input {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.input-field {
  width: 30%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  margin-bottom: 5px;
}

.error-message {
  color: #ff0000;
  font-size: 12px;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
