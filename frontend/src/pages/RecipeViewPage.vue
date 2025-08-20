<template>
  <div class="container">
    <RecipeView
      :recipe-id="$route.params.recipeId"
      :favorites="favorites"
      @favorite-toggled="handleFavoriteToggle"
    />
  </div>
</template>

<script>
import axios from 'axios';
import RecipeView from '@/components/RecipeView.vue';

export default {
  name: 'RecipeViewPage',
  components: {
    RecipeView
  },
  data() {
    return {
      favorites: []
    };
  },
  async mounted() {
    try {
      const res = await axios.get('/users/favorites', { withCredentials: true });
      this.favorites = res.data.map(r => r.recipe_id?.toString?.() || r.id?.toString?.());
    } catch (err) {
      console.error('Failed to load favorites:', err);
    }
  },
  methods: {
    handleFavoriteToggle({ id, liked }) {
      id = id.toString();
      if (liked && !this.favorites.includes(id)) {
        this.favorites.push(id);
      } else if (!liked) {
        this.favorites = this.favorites.filter(favId => favId !== id);
      }
    }
  }
};
</script>
