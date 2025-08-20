<template>
  <div class="last-viewed-recipes">
    <h3 class="section-title">Recently Viewed Recipes -</h3>
    <div v-if="recipes.length > 0" class="recipes-list">
      <RecipePreview
        v-for="recipe in recipes"
        :key="recipe.recipe_id || recipe.id"
        :recipe="recipe"
        :favorites="favorites"
        :viewed-ids="viewedIds"
        @favorite-toggled="handleFavoriteToggle"
      />
    </div>
    <div v-else class="no-recipes">
      עדיין לא צפית בשום מתכון.
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import RecipePreview from './RecipePreview.vue';

export default {
  name: 'LastViewed',
  components: { RecipePreview },
  props: {
    favorites: {
      type: Array,
      default: () => [],
    },
    viewedIds: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['favorite-toggled'],
  data() {
    return {
      recipes: [],
    };
  },
  async mounted() {
    try {
      const { data } = await axios.get('/recipes/viewed', { withCredentials: true });
      this.recipes = data;
    } catch (err) {
      console.error('Failed to fetch last viewed recipes:', err);
    }
  },
  methods: {
    handleFavoriteToggle(payload) {
      this.$emit('favorite-toggled', payload);
    },
  },
};
</script>

<style scoped>
.last-viewed-recipes {
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.section-title {
  margin-bottom: 1rem;
  text-align: center;
  font-size: 1.5rem;
}
.recipes-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}
.no-recipes {
  text-align: center;
  color: #777;
}
</style>
