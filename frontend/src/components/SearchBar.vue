<template>
  <div class="search-bar">
    <form @submit.prevent="emitSearch">
      <div class="form-group">
        <input v-model="title" type="text" placeholder="Search recipes..." class="form-control" />
      </div>

      <div class="form-group">
        <label for="limit">Results Limit:</label>
        <select v-model.number="limit" id="limit" class="form-control">
          <option :value="5">5</option>
          <option :value="10">10</option>
          <option :value="15">15</option>
        </select>
      </div>

      <div class="form-group">
        <label for="cuisine">Cuisine:</label>
        <select v-model="cuisine" id="cuisine" class="form-control">
          <option value="">-- None --</option>
          <option value="italian">Italian</option>
          <option value="mexican">Mexican</option>
          <option value="chinese">Chinese</option>
        </select>
      </div>

      <div class="form-group">
        <label for="diet">Diet:</label>
        <select v-model="diet" id="diet" class="form-control">
          <option value="">-- None --</option>
          <option value="vegan">Vegan</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="gluten_free">Gluten Free</option>
        </select>
      </div>

      <button class="btn btn-primary w-100 mt-2" type="submit">Search</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'SearchBar',
  data() {
    return {
      title: '',
      limit: 5,
      cuisine: '',
      diet: ''
    };
  },
  methods: {
    emitSearch() {
      this.$emit('search', {
        title: this.title,
        limit: this.limit,
        cuisine: this.cuisine,
        diet: this.diet
      });
    }
  }
};
</script>
