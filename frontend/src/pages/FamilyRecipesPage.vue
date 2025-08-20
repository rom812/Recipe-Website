<template>
   <div class="container mt-4">
    <h1>Family Recipes</h1>
    <div v-if="recipes.length === 0">No family recipes to display </div>
    <FamilyRecipes
    v-for="r in recipes"
    :key="r.recipe_id"
    :recipe="r"
    />
   </div> 
</template>
<script>

import {defineComponent,ref,onMounted} from 'vue'
import axios from 'axios'
import FamilyRecipes from '@/components/FamilyRecipes.vue'


export default defineComponent({
    components: {FamilyRecipes},
    setup() {
        const recipes = ref([]);
        onMounted (() => {
            axios.get('/recipes/family-recipes')
                .then(res => {
                    recipes.value = res.data
                })
                .catch(err => console.error ('Error in fetching famiy recipes',err))
        });
        return {recipes};
    }
})
</script>
