<template>
  <div class="register-page">
    <h1>Register</h1>
    <form @submit.prevent="register">
      <div class="form-group">
        <label>Username:</label>
        <input v-model="state.username" type="text" class="form-control" />
        <div v-if="v$.username.$error" class="text-danger">
          Username is required.
        </div>
      </div>
      <div class="form-group">
        <label>Password:</label>
        <input v-model="state.password" type="password" class="form-control" />
        <div v-if="v$.password.$error" class="text-danger">
          Password is required (at least 6 characters).
        </div>
      </div>
      <div class="form-group">
        <label>Confirm Password:</label>
        <input v-model="state.confirmPassword" type="password" class="form-control" />
        <div v-if="v$.confirmPassword.$error" class="text-danger">
          Passwords must match.
        </div>
      </div>
      <button type="submit" class="btn btn-success mt-3">Register</button>
    </form>
  </div>
</template>

<script>
import { reactive } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, sameAs } from '@vuelidate/validators';

export default {
  name: "RegisterPage",
  setup(_, { expose }) {
    const state = reactive({
      username: '',
      password: '',
      confirmPassword: '',
    });

    const rules = {
      username: { required },
      password: { required, minLength: minLength(6) },
      confirmPassword: { required, sameAsPassword: sameAs(() => state.password) }
    };

    const v$ = useVuelidate(rules, state);

    const register = async () => {
      if (await v$.value.$validate()) {
        try {
          await window.axios.post('/register', {
            username: state.username,
            password: state.password
          });
          window.toast("Registration Successful", "You can now login", "success");
          window.router.push('/login');
        } catch (err) {
          window.toast("Registration failed", err.response.data.message, "danger");
        }
      }
    };

    expose({ register });

    return { state, v$, register };
  }
};
</script>

<style scoped>
.register-page {
  max-width: 400px;
  margin: auto;
}
</style>
