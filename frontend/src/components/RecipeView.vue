<template>
  <div v-if="recipe" class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <button class="btn btn-outline-secondary" @click="$router.back()">← Back</button>
      <BaseButton :type="liked ? 'liked' : 'outline'" @click="toggleFavorite">
        <i :class="[liked ? 'fas' : 'far', 'fa-heart', 'heart-icon', { bounce: animate }]"></i>
      </BaseButton>
    </div>

    <div class="recipe-header text-center mb-4 position-relative">
      <span
        v-if="isLoggedIn && viewedBefore"
        class="viewed-badge d-flex align-items-center gap-1"
      >
        <i class="fas fa-eye"></i>
        Viewed
      </span>

      <h2>{{ recipe.title }}</h2>
      <img :src="recipe.image || recipe.img" alt="Recipe image" class="recipe-image" />
    </div>

    <div class="diet-tags my-3">
      <span :class="['tag', recipe.isVegan ? 'yes' : 'no']">
        {{ recipe.isVegan ? '✔ Vegan' : '✖ Vegan' }}
      </span>
      <span :class="['tag', recipe.isVegetarian ? 'yes' : 'no']">
        {{ recipe.isVegetarian ? '✔ Vegetarian' : '✖ Vegetarian' }}
      </span>
      <span :class="['tag', recipe.isGlutenFree ? 'yes' : 'no']">
        {{ recipe.isGlutenFree ? '✔ Gluten-Free' : '✖ Contains Gluten' }}
      </span>
    </div>

    <div class="row">
      <div class="col-md-6">
        <h5>Ingredients</h5>
        <ul>
          <li v-for="(ingredient, index) in recipe.ingredients" :key="index">
            {{ ingredient }}
          </li>
        </ul>
      </div>
      <div class="col-md-6">
        <h5>Instructions</h5>
        <div v-html="recipe.instructions"></div>
      </div>
    </div>

    <div class="mt-4">
      <p><strong>Preparation Time:</strong> {{ recipe.readyInMinutes }} minutes</p>
      <p><strong>Likes:</strong> {{ recipe.popularity }}</p>
    </div>
  </div>

  <div v-else class="text-center py-5">
    <p>Loading recipe...</p>
  </div>
</template>

<script>
import axios from 'axios';
import BaseButton from '@/components/BaseButton.vue';

export default {
  name: 'RecipeView',
  components: { BaseButton },
  props: {
    recipeId: { type: [String, Number], required: true },
    favorites: { type: Array, default: () => [] }
  },
  data() {
    return {
      recipe: null,
      animate: false,
      isLoggedIn: false,
      viewedBefore: false
    };
  },
  computed: {
    liked() {
      const id = String(this.recipe?.recipe_id || this.recipe?.id);
      return this.favorites.includes(id);
    }
  },
  methods: {
    async toggleFavorite() {
      const recipeId = this.recipe.recipe_id || this.recipe.id;
      try {
        if (this.liked) {
          await axios.delete(`/users/favorites/${recipeId}`, { withCredentials: true });
          this.$emit('favorite-toggled', { id: recipeId, liked: false });
        } else {
          await axios.post('/users/favorites', { recipeId }, { withCredentials: true });
          this.animate = true;
          setTimeout(() => (this.animate = false), 300);
          this.$emit('favorite-toggled', { id: recipeId, liked: true });
        }
      } catch (error) {
        if (error.response?.status === 401) {
          alert('You must be logged in to manage favorites.');
        } else {
          console.error('Failed to toggle favorite:', error);
          alert('Something went wrong. Try again later.');
        }
      }
    }
  },
  async mounted() {
    const idStr = String(this.recipeId);

    // 1) Determine login + whether it was viewed BEFORE this visit
    try {
      const res = await axios.get('/recipes/viewed/ids', { withCredentials: true });
      this.isLoggedIn = true;
      const viewedIds = Array.isArray(res.data) ? res.data.map(String) : [];
      this.viewedBefore = viewedIds.includes(idStr);
    } catch (err) {
      if (err?.response?.status === 401) {
        this.isLoggedIn = false;
      } else {
        console.warn('Could not load viewed IDs:', err);
      }
    }

    // 2) Fetch recipe details (independent of login state)
    try {
      const response = await axios.get(`/recipes/${this.recipeId}`, { withCredentials: true });
      this.recipe = response.data;
    } catch (err) {
      console.error('Failed to fetch recipe:', err);
    }

    // 3) Mark as viewed for logged-in users, but do NOT change the badge for this visit
    if (this.isLoggedIn) {
      try {
        await axios.post(`/recipes/viewed/${this.recipeId}`, {}, { withCredentials: true });
        // intentionally not toggling viewedBefore here
      } catch {
        /* noop */
      }
    }
  }
};
</script>

<style scoped>
.recipe-image {
  max-width: 100%;
  border-radius: 10px;
  margin-bottom: 1rem;
}

.recipe-header.position-relative {
  position: relative;
}

.viewed-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  background: #3f51b5;
  color: #fff;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.diet-tags {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin: 0.5rem 0;
}

.tag {
  font-size: 0.75rem;
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  font-weight: 600;
  color: white;
  min-width: 110px;
  text-align: center;
}

.yes { background-color: #4caf50; }
.no  { background-color: #9e9e9e; }

.heart-icon { transition: transform 0.2s ease; }
.bounce { animation: bounce-heart 0.3s ease; }

@keyframes bounce-heart {
  0% { transform: scale(1); }
  40% { transform: scale(1.3); }
  100% { transform: scale(1); }
}
</style>
