<template>
  <div class="container mt-4">
    <h3>{{ title }}</h3>
    <div v-if="recipes.length === 0" class="text-muted text-center py-3">
      No recipes found.
    </div>
    <div class="row">
      <div
        v-for="recipe in recipes"
        :key="recipe.recipe_id || recipe.id"
        class="col-md-4 mb-4"
      >
        <RecipePreview
          :recipe="recipe"
          :favorites="favorites"
          :viewed-ids="viewedIds"
          @favorite-toggled="$emit('favorite-toggled', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import RecipePreview from './RecipePreview.vue';

export default {
  name: 'RecipePreviewList',
  components: { RecipePreview },
  props: {
    title: { type: String, required: true },
    recipes: { type: Array, required: true },
    favorites: { type: Array, default: () => [] },
    viewedIds: { type: Array, default: () => [] }
  }
};
</script>

<style scoped>
.container {
  min-height: 300px;
}
</style>
