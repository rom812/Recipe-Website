<template>
  <div class="container py-4">
    <h2 class="mb-3 fw-bold text-primary text-start">Search Recipes</h2>

    <form @submit.prevent="search" class="mb-4">
      <div class="row g-4">
        <div class="col-md-4">
          <label class="form-label">Recipe Name</label>
          <input v-model="query" type="text" class="form-control" placeholder="Search by name..." />
        </div>

        <div class="col-md-2">
          <label class="form-label">Results</label>
          <select v-model.number="number" class="form-select">
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="15">15</option>
          </select>
        </div>

        <div class="col-md-2">
          <label class="form-label">Cuisine</label>
          <select v-model="cuisine" class="form-select">
            <option value="">Any</option>
            <option value="italian">Italian</option>
            <option value="mexican">Mexican</option>
            <option value="chinese">Chinese</option>
          </select>
        </div>

        <div class="col-md-2">
          <label class="form-label">Diet</label>
          <select v-model="diet" class="form-select">
            <option value="">Any</option>
            <option value="vegan">Vegan</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="gluten_free">Gluten-Free</option>
          </select>
        </div>

        <div class="col-md-2">
          <label class="form-label">Sort by</label>
          <select v-model="sort" class="form-select">
            <option value="">None</option>
            <option value="popularity">Popularity</option>
            <option value="time">Prep Time</option>
          </select>
        </div>

        <div class="col-12 text-end mt-2">
          <button type="submit" class="btn btn-outline-success px-4 py-2 fs-5 fw-bold" :disabled="loading">
            <i class="fas fa-search me-2"></i>
            <span v-if="!loading">Search</span>
            <span v-else>Searching…</span>
          </button>
        </div>
      </div>
    </form>

    <RecipePreviewList
      v-if="results.length"
      :recipes="results"
      :favorites="favorites"
      :viewed-ids="viewedIds"
      :sort-by="sort"
      title="Search Results"
      @favorite-toggled="handleFavoriteToggle"
    />

    <div v-else-if="hasSearched && !loading" class="text-center text-muted mt-5">
      <p>No results found.</p>
    </div>

    <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>
  </div>
</template>

<script>
import axios from 'axios';
import RecipePreviewList from '@/components/RecipePreviewList.vue';

const STORAGE_KEY = 'lastSearch';

export default {
  name: 'SearchResultsPage',
  components: { RecipePreviewList },
  data() {
    return {
      query: '',
      number: 5,
      cuisine: '',
      diet: '',
      sort: '',
      results: [],
      favorites: [],
      viewedIds: [],
      hasSearched: false,
      loading: false,
      error: '',
      isLoggedIn: false
    };
  },
  methods: {
    async checkAuth() {
      try {
        await axios.get('/users/favorites', { withCredentials: true });
        this.isLoggedIn = true;
      } catch {
        this.isLoggedIn = false;
        sessionStorage.removeItem(STORAGE_KEY);
      }
    },

    restoreLastSearchFromSession() {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const ui = JSON.parse(raw);
      if (typeof ui.query === 'string') this.query = ui.query;
      if (typeof ui.number === 'number') this.number = ui.number;
      if (typeof ui.cuisine === 'string') this.cuisine = ui.cuisine;
      if (typeof ui.diet === 'string') this.diet = ui.diet;
      if (typeof ui.sort === 'string') this.sort = ui.sort;
    },

    persistLastSearchToSession() {
      if (!this.isLoggedIn) {
        sessionStorage.removeItem(STORAGE_KEY);
        return;
      }
      const ui = {
        query: this.query,
        number: this.number,
        cuisine: this.cuisine,
        diet: this.diet,
        sort: this.sort
      };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(ui));
    },

    asBool(v) {
      return v === true || v === 'true' || v === 1 || v === '1';
    },

    dietMatches(recipe) {
      const d = (this.diet || '').toLowerCase().replace(/\s+/g, '_');
      if (!d) return true;

      const isGlutenFree =
        this.asBool(recipe.glutenFree) ||
        this.asBool(recipe.isGlutenFree) ||
        this.asBool(recipe.is_gluten_free);

      const isVegan =
        this.asBool(recipe.vegan) ||
        this.asBool(recipe.isVegan) ||
        this.asBool(recipe.is_vegan);

      const isVegetarian =
        this.asBool(recipe.vegetarian) ||
        this.asBool(recipe.isVegetarian) ||
        this.asBool(recipe.is_vegetarian);

      if (d === 'gluten_free') return !!isGlutenFree;
      if (d === 'vegan') return !!isVegan;
      if (d === 'vegetarian') return !!isVegetarian;
      return true;
    },

    async search(payload) {
      if (payload) {
        this.query   = payload.title ?? this.query;
        this.number  = payload.limit ?? this.number;
        this.cuisine = payload.cuisine ?? this.cuisine;
        this.diet    = payload.diet ?? this.diet;
      }

      try {
        this.loading = true;
        this.error = '';
        this.results = [];

        const sortBy =
          this.sort === 'time' ? 'readyInMinutes' :
          this.sort === 'popularity' ? 'popularity' :
          undefined;

        const uiDiet = (this.diet || '').toLowerCase().replace(/\s+/g, '_');

        // Map UI diet to API diet and intolerances
        const apiDiet = uiDiet
          ? (uiDiet === 'gluten_free' ? 'gluten free' : uiDiet.replace(/_/g, ' '))
          : undefined;

        const rawParams = {
          title: this.query?.trim() || undefined,
          limit: this.number,
          cuisine: this.cuisine || undefined,
          diet: apiDiet,
          sortBy,
          order: sortBy ? 'desc' : undefined,
          ...(uiDiet === 'gluten_free' ? { intolerances: 'gluten' } : {})
        };

        const params = Object.fromEntries(
          Object.entries(rawParams).filter(([, v]) => v !== undefined && v !== '')
        );

        const { data } = await axios.get('/recipes', { params, withCredentials: true });

        let items = Array.isArray(data) ? data : (data?.results || []);

        // Client-side guard to ensure diet filtering also applies to local recipes
        if (uiDiet) {
          items = items.filter((r) => this.dietMatches(r));
        }

        this.results = items;
        this.hasSearched = true;

        this.persistLastSearchToSession();
      } catch (err) {
        console.error('Search failed:', err);
        this.error = err?.response?.data?.message || 'Search failed';
        this.results = [];
        this.hasSearched = true;
      } finally {
        this.loading = false;
      }
    },

    handleFavoriteToggle({ id, liked }) {
      const strId = String(id);
      if (liked && !this.favorites.includes(strId)) {
        this.favorites.push(strId);
      } else if (!liked && this.favorites.includes(strId)) {
        this.favorites = this.favorites.filter(f => f !== strId);
      }
    }
  },

  async mounted() {
    await this.checkAuth();

    if (this.isLoggedIn) {
      this.restoreLastSearchFromSession();
      if (this.query || this.cuisine || this.diet || this.sort) {
        this.search();
      }
    }

    try {
      if (this.isLoggedIn) {
        const favRes = await axios.get('/users/favorites', { withCredentials: true });
        this.favorites = favRes.data.map(f => String(f.recipe_id ?? f.id));

        const viewedRes = await axios.get('/recipes/viewed/ids', { withCredentials: true });
        this.viewedIds = viewedRes.data.map(String);
      }
    } catch (err) {
      console.warn('Could not load favorites/viewed IDs:', err);
    }
  }
};
</script>

<style scoped>
input.form-control,
select.form-select {
  text-align: left;
}
</style>
