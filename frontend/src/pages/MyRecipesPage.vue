<template>
  <div class="container mt-4">
    <h1 class="text-center mb-4">👨‍🍳 Your Recipes</h1>

    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else-if="recipes.length === 0" class="empty-message text-center text-muted my-5">
      <i class="fas fa-utensils fa-2x mb-2"></i>
      <p>You haven’t created any recipes yet.</p>
    </div>

    <div v-else class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
      <div class="col" v-for="r in recipes" :key="r.recipe_id || r.id">
        <RecipePreview
          :recipe="r"
          :favorites="favoriteIds"
          :viewed-ids="viewedIds"
          @favorite-toggled="handleFavoriteToggle"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import axios from 'axios';
import RecipePreview from '@/components/RecipePreview.vue';

export default defineComponent({
  name: "MyRecipesPage",
  components: { RecipePreview },
  setup() {
    const recipes = ref([]);
    const favoriteIds = ref([]);
    const viewedIds = ref([]);
    const loading = ref(true);

    const loadMyRecipes = async () => {
      try {
        const [myRes, favRes, viewedRes] = await Promise.all([
          axios.get('/recipes/myRecipes', { withCredentials: true }),
          axios.get('/users/favorites', { withCredentials: true }),
          axios.get('/recipes/viewed/ids', { withCredentials: true })
        ]);

        recipes.value = myRes.data;
        favoriteIds.value = favRes.data.map(r => String(r.recipe_id || r.id));
        viewedIds.value = viewedRes.data.map(String);
      } catch (err) {
        console.error('Error loading my recipes:', err);
      } finally {
        loading.value = false;
      }
    };

    const handleFavoriteToggle = ({ id, liked }) => {
      const strId = String(id);

      if (liked && !favoriteIds.value.includes(strId)) {
        favoriteIds.value.push(strId);
      } else if (!liked && favoriteIds.value.includes(strId)) {
        favoriteIds.value = favoriteIds.value.filter(f => f !== strId);
      }
    };

    onMounted(loadMyRecipes);

    return {
      recipes,
      favoriteIds,
      viewedIds,
      handleFavoriteToggle,
      loading
    };
  }
});
</script>

<style scoped>
.empty-message {
  font-size: 1.2rem;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}
</style>
