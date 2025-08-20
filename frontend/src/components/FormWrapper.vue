<template>
  <div class="form-wrapper">
    <div class="form-box">
      <img src="@/assets/logo.png" alt="Logo" class="logo" />
      <h1 class="form-title">{{ title }}</h1>
      <slot/>
    </div>
  </div>
</template>

<script>
export default {
  props: ['title']
};
</script>

<style scoped>
.form-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  /* background: linear-gradient(to right, #f7e9d7, #ffe9e3); */
  font-family: 'Segoe UI', sans-serif;
}

.form-box {
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 420px;
  text-align: center;
}

.logo {
  width: 80px;
  margin-bottom: 1rem;
}

.form-title {
  font-size: 28px;
  margin-bottom: 1.5rem;
  color: #e76f51;
  font-weight: bold;
}
</style>
