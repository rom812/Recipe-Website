<template>
  <div id="app">
    <template v-if="checkedLogin">
      <div id="nav">
        <router-link class="btn--nav" :to="{ name: 'main' }">Main Menu</router-link>
        <router-link class="btn--nav" :to="{ name: 'search' }">Search</router-link>
        <router-link class="btn--nav" :to="{ name: 'about' }">About</router-link>

        <div v-if="!store?.username" class="guest-links">
          <router-link class="btn--nav" :to="{ name: 'register' }">Register</router-link>
          <router-link class="btn--nav" :to="{ name: 'login' }">Login</router-link>
        </div>

        <div v-else class="user-info">
          <router-link class="btn--nav" :to="{ name: 'create-recipe' }">Add a Recipe</router-link>
          <span>{{ store.username }}:</span>
          <BaseButton type="nav" @click="logout">Logout</BaseButton>
          <PersonalMenu />
        </div>
      </div>

      <router-view />
    </template>

    <div v-else class="loading-screen">
      <p>Checking login status...</p>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, computed, onMounted, ref } from 'vue';
import axios from 'axios';
import BaseButton from "@/components/BaseButton.vue";
import PersonalMenu from "@/components/PersonalMenu.vue";

export default {
  name: "App",
  components: {
    BaseButton,
    PersonalMenu
  },
  setup() {
    const internalInstance = getCurrentInstance();
    const store = internalInstance.appContext.config.globalProperties.store;
    const toast = internalInstance.appContext.config.globalProperties.toast;
    const router = internalInstance.appContext.config.globalProperties.$router;
    const checkedLogin = ref(false);

    const logout = async () => {
      try {
        await axios.post('/auth/logout', {}, { withCredentials: true });
      } catch (err) {
        console.error("Logout request failed:", err);
      }

      store.logout();
      toast("Logout", "User logged out successfully", "success");
      router.push("/").catch(() => {});
    };

    const username = computed(() => store?.username);

    onMounted(async () => {
      try {
        const res = await axios.get('/users/me', { withCredentials: true });
        if (res.status === 200 && res.data?.username) {
          store.login(res.data.username);
        } else {
          store.logout();
        }
      } catch {
        store.logout();
      } finally {
        checkedLogin.value = true;
      }
    });

    return {
      store,
      username,
      logout,
      checkedLogin
    };
  }
};
</script>

<style lang="scss">
@import "@/scss/form-style.scss";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
  padding-top: 80px;
}

#nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 1rem 2rem;
  background: #ffffff;
  border-radius: 0 0 12px 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  font-family: 'Segoe UI', sans-serif;
  z-index: 999;
}

a.btn--nav {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: background-color 0.3s, color 0.3s;
}

a.btn--nav:hover {
  background-color: #f2f2f2;
  color: #e76f51;
}

a.router-link-exact-active {
  background-color: #e76f51;
  color: white;
}

#nav .guest-links,
#nav .user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.loading-screen {
  text-align: center;
  padding: 2rem;
}
</style>
