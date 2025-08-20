<template>
  <div class="container mt-4">
    <h1 class="text-center mb-4">❤️ Your Favorite Recipes</h1>

    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else-if="recipes.length === 0" class="empty-message text-center text-muted my-5">
      <i class="fas fa-heart-broken fa-2x mb-2"></i>
      <p>You haven’t favorited any recipes yet.</p>
    </div>

    <div v-else class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
      <div class="col" v-for="r in recipes" :key="r.recipe_id || r.id">
        <RecipePreview
          :recipe="r"
          :favorites="favoriteIds.map(f => String(f.recipe_id || f.id))"
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
  name: "FavoriteRecipesPage",
  components: { RecipePreview },
  setup() {
    const recipes = ref([]);
    const favoriteIds = ref([]);
    const viewedIds = ref([]);
    const loading = ref(true);

    const loadFavorites = async () => {
      try {
        const { data: ids } = await axios.get('/users/favorites', { withCredentials: true });
        favoriteIds.value = ids;

        const recipeResponses = await Promise.all(
          ids.map(({ id, recipe_id }) =>
            axios.get(`/recipes/${recipe_id || id}`, { withCredentials: true })
          )
        );

        recipes.value = recipeResponses.map(res => res.data);
      } catch (err) {
        console.error('Error loading favorite recipes:', err);
      }
    };

    const fetchViewedIds = async () => {
      try {
        const res = await axios.get('/recipes/viewed/ids', { withCredentials: true });
        viewedIds.value = res.data.map(id => String(id));
      } catch (err) {
        console.warn("Could not load viewed recipes");
        viewedIds.value = [];
      }
    };

    const handleFavoriteToggle = ({ id, liked }) => {
      const strId = String(id);

      if (liked && !favoriteIds.value.includes(strId)) {
        favoriteIds.value.push(strId);
      } else if (!liked && favoriteIds.value.includes(strId)) {
        favoriteIds.value = favoriteIds.value.filter(f => f !== strId);
        recipes.value = recipes.value.filter(r =>
          String(r.recipe_id || r.id) !== strId
        );
      }
    };

    onMounted(async () => {
      await Promise.all([loadFavorites(), fetchViewedIds()]);
      loading.value = false;
    });

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
