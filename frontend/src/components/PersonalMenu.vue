<template>
  <div class="personal-wrapper" ref="menuRef">
    <BaseButton type="nav" @click="showMenu = !showMenu">
      Personal ▾
    </BaseButton>

    <ul v-if="showMenu" class="personal-menu">
      <li>
        <router-link to="/favorites">Favorites</router-link>
      </li>
      <li>
        <router-link to="/recipes/myRecipes">Your Recipes</router-link>
      </li>
      <li>
        <router-link to="/recipes/family-recipes">Family Recipes</router-link>
      </li>


    </ul>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import BaseButton from "@/components/BaseButton.vue";

export default {
  name: "PersonalMenu",
  components: {
    BaseButton
  },
  setup() {
    const showMenu = ref(false);
    const menuRef = ref(null);

    const handleClickOutside = (event) => {
      if (menuRef.value && !menuRef.value.contains(event.target)) {
        showMenu.value = false;
      }
    };

    onMounted(() => {
      document.addEventListener('click', handleClickOutside);
    });

    onBeforeUnmount(() => {
      document.removeEventListener('click', handleClickOutside);
    });

    return {
      showMenu,
      menuRef
    };
  }
};
</script>

<style scoped>
.personal-wrapper {
  position: relative;
  display: inline-block;
}

.personal-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  list-style: none;
  margin-top: 0.25rem;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-width: 180px;
}

.personal-menu li {
  margin: 0.5rem 0;
}

.personal-menu a {
  text-decoration: none;
  color: #333;
  display: block;
  width: 100%;
}

.personal-menu a:hover {
  text-decoration: underline;
}
</style>
