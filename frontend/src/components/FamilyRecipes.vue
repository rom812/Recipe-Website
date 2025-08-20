<template>
  <div class="card mb-4">
    <div class="card-body">
      <h5 class="card-title">{{ recipe.title || 'Untitled Recipe' }}</h5>
      <h6 v-if="recipe.originator" class="card-subtitle mb-2 text-muted">
        By {{ recipe.originator }}
      </h6>
      <p class="card-text"><strong>Occasion:</strong> {{ recipe.occasion }}</p>

      <p class="card-text"><strong>Ingredients:</strong></p>
      <ul v-if="parsedIngredients.length">
  <li v-for="(item, index) in parsedIngredients" :key="index">
    {{ item }}
  </li>
</ul>
<p v-else class="text-muted">No ingredients provided</p>


      <p class="card-text"><strong>Instructions:</strong></p>
      <pre style="white-space: pre-wrap;">{{ recipe.instructions }}</pre>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    recipe: {
      type: Object,
      required: true
    }
  },
  computed: {
    parsedIngredients() {
  try {
    if (typeof this.recipe.ingredients === 'string') {
      return JSON.parse(this.recipe.ingredients);
    }
    return Array.isArray(this.recipe.ingredients)
      ? this.recipe.ingredients
      : [];
  } catch (err) {
    console.warn("Failed to parse ingredients:", this.recipe.ingredients);
    return [];
  }
}

  }
});
</script>
