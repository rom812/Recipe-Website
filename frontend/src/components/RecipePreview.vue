<template>
  <div
    class="card recipe-card position-relative"
    :class="{ viewed: hasBeenViewed }"
    @click="goToRecipe"
  >
    <!-- viewed badge -->
    <span v-if="hasBeenViewed" class="viewed-badge d-flex align-items-center gap-1">
      <i class="fas fa-eye"></i>
      Viewed
    </span>

    <img
      :src="recipe.image"
      alt="Recipe image"
      class="card-img-top recipe-image"
    />

    <div class="card-body text-center">
      <h5 class="card-title">{{ formattedName }}</h5>
      <p class="card-text">{{ recipe.readyInMinutes }} minutes</p>
      <p class="card-text">{{ recipe.popularity }} likes</p>

      <div class="diet-tags">
        <span :class="['tag', recipe.isVegan ? 'yes' : 'no']">
          {{ recipe.isVegan ? '✔ Vegan' : '✖ Vegan' }}
        </span>
        <span :class="['tag', recipe.isVegetarian ? 'yes' : 'no']">
          {{ recipe.isVegetarian ? '✔ Vegetarian' : '✖ Vegetarian' }}
        </span>
        <span :class="['tag', recipe.isGlutenFree ? 'yes' : 'no']">
          {{ recipe.isGlutenFree ? '✔ Gluten‑Free' : '✖ Contains Gluten' }}
        </span>
      </div>

      <BaseButton :type="liked ? 'liked' : 'outline'" @click.stop="toggleFavorite">
        <i :class="[liked ? 'fas' : 'far', 'fa-heart', 'heart-icon', { bounce: animate }]" />
      </BaseButton>
    </div>
  </div>
</template>

<script>
import BaseButton from '@/components/BaseButton.vue';
import axios from 'axios';


export default {
  name: 'RecipePreview',
  components: { BaseButton },
  props: {
    recipe: { type: Object, required: true },
    favorites: { type: Array, default: () => [] },
    viewedIds: { type: Array, default: () => [] }
  },
  data() {
    return { animate: false };
  },
  computed: {
    liked() {
      const id = String(this.recipe.recipe_id || this.recipe.id);
      return this.favorites.includes(id);
    },
    hasBeenViewed() {
      const id = String(this.recipe.recipe_id || this.recipe.id);
      return this.viewedIds.includes(id);
    },
    formattedName() {
      if (!this.recipe.title) return '';
      return this.recipe.title
        .split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
    }
  },
  methods: {
    goToRecipe() {
      const id = this.recipe.recipe_id || this.recipe.id;
      this.$router.push({ name: 'recipe', params: { recipeId: id } });
    },
    async toggleFavorite() {
  const id = this.recipe.recipe_id || this.recipe.id;
  try {
    if (this.liked) {
      await axios.delete(`/users/favorites/${id}`, { withCredentials: true });
      this.$emit('favorite-toggled', { id, liked: false });
    } else {
      await axios.post('/users/favorites', { recipeId: id }, { withCredentials: true });
      this.animate = true;
      setTimeout(() => (this.animate = false), 300);
      this.$emit('favorite-toggled', { id, liked: true });
    }
  } catch (err) {
    console.error('Favorite toggle failed:', err);
    alert('פעולה נכשלה, נסה שוב.');
  }
}

  }
};
</script>

<style scoped>
.recipe-image {
  max-width: 100%;
  height: auto;
  border-radius: 10px;
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

.heart-icon {
  transition: transform 0.2s ease;
}

.bounce {
  animation: bounce-heart 0.3s ease;
}

@keyframes bounce-heart {
  0% { transform: scale(1); }
  40% { transform: scale(1.3); }
  100% { transform: scale(1); }
}

.card.recipe-card {
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.card.recipe-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: #fef7f7;
}
.card.recipe-card.viewed {
  border: 2px solid #3f51b5;
  background-color: #e8eaf6;
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
  color: #fff;
  min-width: 110px;
  text-align: center;
}
.yes { background-color: #4caf50; }
.no { background-color: #9e9e9e; }
</style>
