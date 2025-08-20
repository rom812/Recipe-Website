import Main from "../pages/MainPage.vue";
import NotFound from "../pages/NotFoundPage.vue";
import { createRouter, createWebHistory } from 'vue-router';
import axios from 'axios';

const routes = [
  { path: "/", name: "main", component: Main },
  { path: "/register", name: "register", component: () => import("../pages/RegisterPage.vue") },
  { path: "/login", name: "login", component: () => import("../pages/LoginPage.vue") },
  { path: "/search", name: "search", component: () => import("../pages/SearchPage.vue") },
  { path: "/about", name: "about",   component: () => import('../pages/AboutPage.vue') },
  { path: "/recipes/:recipeId", name: "recipe", component: () => import("@/pages/RecipeViewPage.vue") },
  { path: '/recipes/family-recipes', name: 'family-recipes', component: () => import('@/pages/FamilyRecipesPage.vue') },
  { path: '/recipes/create', name: 'create-recipe', component: () => import('@/pages/CreateRecipeModalPage.vue') },
  { path: "/favorites", name: "favorites", component: () => import('@/pages/Favorites.vue') },
  { path: "/recipes/myRecipes", name: "my-recipes", component: () => import('@/pages/MyRecipesPage.vue') },

  { path: "/:catchAll(.*)", name: "notFound", component: NotFound }

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (to.path === '/login') {
    try {
      const res = await axios.get('/users/me');
      if (res.status === 200 && res.data?.username) {
        return next('/');
      }
    } catch {
      // לא מחובר, תמשיך ל-login
    }
  }
  next();
});

export default router;
