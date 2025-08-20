import { reactive } from 'vue';

const store = reactive({
  username: null,
  server_domain: "http://localhost:3000",

  login(username) {
    this.username = username;
    console.log("login", this.username);
  },

  logout() {
    this.username = null;
  }
});

export default store;
