<template>
  <div class="search-results">
    <div v-if="(recipes?.length ?? 0) === 0" class="no-results">
      לא נמצאו תוצאות רלוונטיות.
    </div>
    <div v-else class="row">
      <div
        v-for="recipe in sortedRecipes"
        :key="recipe.recipe_id || recipe.id"
        class="col-md-4 mb-4"
      >
        <RecipePreview :recipe="recipe" />
      </div>
    </div>
  </div>
</template>

<script>
import RecipePreview from "@/components/RecipePreview.vue";

export default {
  name: "SearchResults",
  components: { RecipePreview },
  props: {
    recipes: {
      type: Array,
      default: () => [] // remove "required: true" if you keep a default
    },
    sortBy: {
      type: String,
      default: "popularity" // "", "popularity", "time", or "readyInMinutes"
    }
  },
  computed: {
    sortedRecipes() {
      // map external values to internal keys
      const sortKey = this.sortBy === "time" ? "readyInMinutes" : this.sortBy;

      // no sort
      if (!sortKey) return [...this.recipes];

      // sort by time (ascending)
      if (sortKey === "readyInMinutes") {
        return [...this.recipes].sort((a, b) => {
          const av = Number(a.readyInMinutes ?? Number.POSITIVE_INFINITY);
          const bv = Number(b.readyInMinutes ?? Number.POSITIVE_INFINITY);
          return av - bv;
        });
      }

      // default: popularity (descending)
      if (sortKey === "popularity") {
        return [...this.recipes].sort((a, b) => {
          const av = Number(a.popularity ?? Number.NEGATIVE_INFINITY);
          const bv = Number(b.popularity ?? Number.NEGATIVE_INFINITY);
          return bv - av;
        });
      }

      // unknown sort key -> no sort
      return [...this.recipes];
    }
  }
};
</script>

<style scoped>
.no-results {
  text-align: center;
  font-weight: bold;
  font-size: 1.2rem;
  margin-top: 2rem;
}
</style>
