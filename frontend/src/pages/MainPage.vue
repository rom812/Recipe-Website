<template>
  <div class="main-container">
    <div class="left-column">
      <h2 class="section-title">Explore These Recipes - </h2>

      <div class="recipe-list">
        <RecipePreview
          v-for="recipe in randomRecipes"
          :key="recipe.recipe_id || recipe.id"
          :recipe="recipe"
          :favorites="favorites"
          :viewed-ids="viewedIds"
          @favorite-toggled="handleFavoriteToggle"
        />
      </div>

      <BaseButton type="more" @click="loadMoreRecipes">
        Show Other Recipes
      </BaseButton>
    </div>

    <div class="right-column">
      <template v-if="store.username">
        <LastViewed
          :favorites="favorites"
          :viewed-ids="viewedIds"
          @favorite-toggled="handleFavoriteToggle"
        />
        <button class="logout-button" @click="logout">Logout</button>
      </template>

      <template v-else-if="checkedLogin">
        <div class="auth-box">
          <h2 class="welcome-message">Welcome! How do you want to start?</h2>
          <LoginPage v-if="!isRegistering" @toggle-auth="toggleAuthMode" />
          <RegisterPage v-else @toggle-auth="toggleAuthMode" />
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, getCurrentInstance } from 'vue';
import axios from 'axios';

import RecipePreview from '@/components/RecipePreview.vue';
import LastViewed     from '@/components/LastViewed.vue';
import BaseButton     from '@/components/BaseButton.vue';
import LoginPage      from '@/pages/LoginPage.vue';
import RegisterPage   from '@/pages/RegisterPage.vue';

const STORAGE_KEY = 'lastSearch';

export default {
  components: {
    RecipePreview,
    LastViewed,
    BaseButton,
    LoginPage,
    RegisterPage,
  },
  setup() {
    const randomRecipes = ref([]);
    const favorites     = ref([]);
    const viewedIds     = ref([]);
    const checkedLogin  = ref(false);
    const isRegistering = ref(false);

    const { appContext } = getCurrentInstance();
    const store = appContext.config.globalProperties.store;

    const toggleAuthMode = () => (isRegistering.value = !isRegistering.value);

    const logout = async () => {
      try {
        await axios.post('/auth/logout', {}, { withCredentials: true });
      } catch (err) {
        console.error('Logout failed:', err);
      } finally {
        sessionStorage.removeItem(STORAGE_KEY);
        store.logout();
        window.location.reload();
      }
    };

    const fetchRecipes = async () => {
      const { data } = await axios.get('/recipes/random');
      randomRecipes.value = data;
    };

    const fetchFavorites = async () => {
      const { data } = await axios.get('/users/favorites', { withCredentials: true });
      favorites.value = data.map(f => String(f.recipe_id || f.id));
    };

    const fetchViewedIds = async () => {
      try {
        const { data } = await axios.get('/recipes/viewed/ids', { withCredentials: true });
        viewedIds.value = data.map(String);
      } catch {
        viewedIds.value = [];
      }
    };

    const checkLogin = async () => {
      try {
        const { data } = await axios.get('/users/me', { withCredentials: true });
        if (data?.username) store.login(data.username);
      } finally {
        checkedLogin.value = true;
      }
    };

    const handleFavoriteToggle = ({ id, liked }) => {
      const strId = String(id);
      if (liked && !favorites.value.includes(strId)) {
        favorites.value.push(strId);
      } else if (!liked) {
        favorites.value = favorites.value.filter(f => f !== strId);
      }
    };

    const loadMoreRecipes = fetchRecipes;

    onMounted(async () => {
      await fetchRecipes();
      await checkLogin();

      if (store.username) {
        await Promise.all([fetchFavorites(), fetchViewedIds()]);
      } else {
        await fetchViewedIds();
      }
    });

    return {
      randomRecipes,
      favorites,
      viewedIds,
      checkedLogin,
      isRegistering,
      store,
      toggleAuthMode,
      logout,
      handleFavoriteToggle,
      loadMoreRecipes,
    };
  }
};
</script>

<style scoped>
.main-container {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  padding: 2rem;
}

.left-column {
  flex: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.right-column {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.recipe-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 1rem;
}

.section-title {
  text-align: center;
  margin-bottom: 1rem;
}

.logout-button {
  margin-top: 1rem;
  padding: 0.5rem 1.5rem;
  background-color: #ef4444;
  border: none;
  color: white;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
}
.logout-button:hover {
  background-color: #dc2626;
}

@media (max-width: 768px) {
  .main-container {
    flex-direction: column;
    align-items: center;
  }

  .right-column {
    margin-top: 2rem;
  }
}

.welcome-message {
  font-size: 1.8rem;
  font-weight: 600;
  color: #ef6c57;
  text-align: center;
  margin-bottom: 1.5rem;
  background-color: #fff8f6;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.auth-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}
</style>
