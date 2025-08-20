<template>
  <button @click="FavoriteBtn" class="btn btn-outline-danger">
    ❤️ Add to Favorites
  </button>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    recipeId: {
      type: String,
      required: true
    }
  },
  methods: {
    async FavoriteBtn() {
      try {
        await axios.post(`/users/favorites`, {
          recipeId: this.recipeId
        });
        this.$root.toast("Success", "Recipe added to favorites", "success");
      } catch (error) {
        console.error("Failed to add to favorites", error);
        this.$root.toast("Error", "Could not add recipe", "danger");
      }
    }
  }
};
</script>
