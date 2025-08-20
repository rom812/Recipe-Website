<template>
  <button :class="computedClass" :type="htmlType">
    <slot />
  </button>
</template>

<script>
export default {
  name: "BaseButton",
  props: {
    type: {
      type: String,
      default: "submit", 
   validator: (val) =>
  ["submit", "login", "register", "outline", "nav", "more", "link", "liked"].includes(val),

    },
    htmlType: {
      type: String,
      default: "button", 
    },
  },
  computed: {
    computedClass() {
      return `btn btn--${this.type}`;
    },
  },
};
</script>
