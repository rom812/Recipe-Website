<template>
  <div class="container py-5">
    <b-row align-h="center">
      <b-col cols="12" md="10" lg="8">
        <b-card class="text-center shadow-lg border-0 rounded-4 p-4">
          <h2 class="mb-3 display-6 fw-bold">Add a New Recipe</h2>
          <b-button
            size="lg"
            variant="outline-primary"
            class="rounded-pill px-5 py-2 d-inline-flex align-items-center gap-2 shadow-sm fw-bold fs-5"
            @click="showModal = true"
          >
            <i class="fas fa-plus-circle"></i>
            <span>Let's do it</span>
          </b-button>


          <transition name="fade">
            <b-alert v-if="successMessage" variant="success" class="mt-4" dismissible show>
              {{ successMessage }}
            </b-alert>
          </transition>
        </b-card>
      </b-col>
    </b-row>

    <CreateRecipeModal
      :show="showModal"
      @update:show="showModal = $event"
      @created="onRecipeCreated"
    />
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { BRow, BCol, BCard, BButton, BAlert } from 'bootstrap-vue-3';
import CreateRecipeModal from '@/components/CreateRecipeModal.vue';

export default defineComponent({
  name: 'NewRecipePage',
  components: {
    CreateRecipeModal,
    BRow,
    BCol,
    BCard,
    BButton,
    BAlert,
  },
  setup() {
    const showModal = ref(false);
    const successMessage = ref('');

    // Handler for a successful recipe creation
    function onRecipeCreated() {
      successMessage.value = 'The Recipe Saved Succesfully!';
      showModal.value = false;
      // Clear the message after 4 seconds
      setTimeout(() => {
        successMessage.value = '';
      }, 4000);
    }

    return {
      showModal,
      successMessage,
      onRecipeCreated,
    };
  },
});
</script>

<style scoped>
/* simple fade animation for the alert */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
