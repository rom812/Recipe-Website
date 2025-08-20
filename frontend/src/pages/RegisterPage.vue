<template>
  <FormWrapper title="Register">
    <form @submit.prevent="register">
      <!-- First name -->
      <div class="form-group">
        <input v-model="state.firstName" type="text" placeholder="First name" class="form-input" />
        <div v-if="v$.firstName.$error" class="text-danger">This field is required</div>
      </div>

      <!-- Last name -->
      <div class="form-group">
        <input v-model="state.lastName" type="text" placeholder="Last name" class="form-input" />
        <div v-if="v$.lastName.$error" class="text-danger">This field is required</div>
      </div>

      <!-- Username -->
      <div class="form-group">
        <input
          v-model="state.username"
          @input="sanitizeUsername"
          type="text"
          placeholder="Username"
          class="form-input"
          autocomplete="username"
          maxlength="8"
        />
        <div v-if="v$.username.$error" class="text-danger">
          <span v-if="v$.username.$errors.find(e => e.$validator === 'required')">This field is required</span>
          <span v-else-if="v$.username.$errors.find(e => e.$validator === 'minLength')">At least 3 characters</span>
          <span v-else-if="v$.username.$errors.find(e => e.$validator === 'maxLength')">Max 8 characters</span>
          <span v-else-if="v$.username.$errors.find(e => e.$validator === 'englishLettersOnly')">English letters only</span>
        </div>
      </div>

      <!-- Password -->
      <div class="form-group password-wrapper">
        <input
          v-model="state.password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Password"
          class="form-input"
        />
        <div :class="['toggle-password-icon', showPassword ? 'eye-slash' : 'eye']" @click="showPassword = !showPassword"></div>
        <div v-if="v$.password.$error" class="text-danger">
          <span v-if="v$.password.$errors.find(e => e.$validator === 'required')">This field is required</span>
          <span v-else-if="v$.password.$errors.find(e => e.$validator === 'minLength')">At least 5 characters</span>
          <span v-else-if="v$.password.$errors.find(e => e.$validator === 'maxLength')">Max 10 characters</span>
          <span v-else-if="v$.password.$errors.find(e => e.$validator === 'hasNumber')">Must contain at least one number</span>
          <span v-else-if="v$.password.$errors.find(e => e.$validator === 'hasSpecialChar')">Must contain a special character</span>
        </div>
      </div>

      <!-- Confirm password -->
      <div class="form-group password-wrapper">
        <input
          v-model="state.confirmPassword"
          :type="showConfirmPassword ? 'text' : 'password'"
          placeholder="Confirm password"
          class="form-input"
        />
        <div :class="['toggle-password-icon', showConfirmPassword ? 'eye-slash' : 'eye']" @click="showConfirmPassword = !showConfirmPassword"></div>
      </div>
      <div v-if="v$.confirmPassword.$error" class="text-danger">
        <span v-if="v$.confirmPassword.$errors.find(e => e.$validator === 'required')">This field is required</span>
        <span v-else-if="v$.confirmPassword.$errors.find(e => e.$validator === 'sameAsPassword')">Passwords do not match</span>
      </div>

      <!-- Email -->
      <div class="form-group">
        <input v-model="state.email" type="email" placeholder="Email" class="form-input" />
        <div v-if="v$.email.$error" class="text-danger">
          <span v-if="v$.email.$errors.find(e => e.$validator === 'required')">This field is required</span>
          <span v-else-if="v$.email.$errors.find(e => e.$validator === 'email')">Invalid email address</span>
        </div>
      </div>

      <!-- Country -->
      <div class="form-group">
        <select v-model="state.country" class="form-input">
          <option value="" disabled>Select country</option>
          <option v-for="c in state.countries" :key="c">{{ c }}</option>
        </select>
        <div v-if="v$.country.$error" class="text-danger">This field is required</div>
      </div>

      <!-- Server-side error -->
      <div v-if="serverError" class="text-danger">{{ serverError }}</div>

      <!-- Submit -->
      <BaseButton type="register" htmlType="submit" class="mt-2">Register</BaseButton>
    </form>

    <!-- Switch to login -->
    <p class="mt-3">
      Already have an account?
      <BaseButton type="link" @click="$emit('toggle-auth')">Log in</BaseButton>
    </p>
  </FormWrapper>
</template>

<script>
import { reactive, onMounted, nextTick, ref, computed, getCurrentInstance } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, maxLength, email, sameAs, helpers } from '@vuelidate/validators';
import FormWrapper from '@/components/FormWrapper.vue';
import countries from '@/assets/countries.json';
import { useRouter } from 'vue-router';
import BaseButton from '@/components/BaseButton.vue';

export default {
  name: 'RegisterPage',
  components: { FormWrapper, BaseButton },
  setup() {
    const { proxy } = getCurrentInstance();
    const showPassword = ref(false);
    const showConfirmPassword = ref(false);
    const serverError = ref('');
    const router = useRouter();

    const state = reactive({
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      country: '',
      password: '',
      confirmPassword: '',
      countries: []
    });

    const passwordValue = computed(() => state.password);

   
    const englishLettersOnly = helpers.withMessage(
      'English letters only',
      (value) => {
        if (!value) return true; 
        return /^[a-zA-Z]+$/.test(value);
      }
    );

    const rules = {
      username: { 
        required, 
        minLength: minLength(3), 
        maxLength: maxLength(8), 
        englishLettersOnly 
      },
      firstName: { required },
      lastName: { required },
      email: { required, email },
      country: { required },
      password: {
        required,
        minLength: minLength(5),
        maxLength: maxLength(10),
        hasNumber: helpers.withMessage(
          'Password must contain a number',
          (value) => !value || /\d/.test(value)
        ),
        hasSpecialChar: helpers.withMessage(
          'Password must contain a special character',
          (value) => !value || /[!@#$%^&*(),.?":{}|<>]/.test(value)
        )
      },
      confirmPassword: { 
        required, 
        sameAsPassword: sameAs(passwordValue, 'Passwords do not match') 
      }
    };

    const v$ = useVuelidate(rules, state);

    onMounted(() => {
      state.countries = countries.map(c => c.name);
    });

 
    const sanitizeUsername = () => {
   
      const cleaned = (state.username || '').replace(/[^a-zA-Z]/g, '').slice(0, 8);
      if (cleaned !== state.username) {
        state.username = cleaned;
      }
    };

    const register = async () => {
      serverError.value = '';
      v$.value.$touch();
      await nextTick();
      if (v$.value.$invalid) return;

      try {
        const res = await proxy.axios.post('/auth/register', {
          username: state.username,
          firstname: state.firstName,
          lastname: state.lastName,
          email: state.email,
          country: state.country,
          password: state.password
        });

        if (res.status === 201) {
          router.push('/login');
        } else {
          serverError.value = 'Registration failed – unexpected status';
        }
      } catch (err) {
        const msg = (err.response?.data?.message || '').toLowerCase();
        const status = err.response?.status || '';
        
        if (status === 409 && msg.includes('username')) {
          serverError.value = 'Username already exists';
        } else if (status === 409 && msg.includes('email')) {
          serverError.value = 'Email already registered';
        } else if (status === 400) {
          serverError.value = err.response?.data?.errors?.[0]?.msg || 'Invalid registration data';
        } else {
          serverError.value = `Unexpected error (${status}). Please try again`;
        }
      }
    };

    return { 
      state, 
      v$, 
      register, 
      showPassword, 
      showConfirmPassword, 
      serverError, 
      sanitizeUsername 
    };
  }
};
</script>

<style scoped>
.form-input {
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 0.25rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  box-sizing: border-box;
}

.text-danger {
  color: #dc3545;
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
  text-align: left;
}

.form-group { 
  margin-bottom: 1rem; 
}

.password-wrapper { 
  position: relative; 
}

.toggle-password-icon {
  position: absolute;
  top: 50%;
  right: 0.75rem;
  transform: translateY(-50%);
  cursor: pointer;
  width: 20px;
  height: 20px;
  transition: opacity 0.2s;
}

.toggle-password-icon:hover { 
  opacity: 0.7; 
}

.eye::before { 
  content: ''; 
  position: absolute; 
  width: 18px; 
  height: 12px; 
  border: 2px solid #666; 
  border-radius: 18px; 
  top: 4px; 
  left: 1px; 
}

.eye::after { 
  content: ''; 
  position: absolute; 
  width: 8px; 
  height: 8px; 
  background: #666; 
  border-radius: 50%; 
  top: 6px; 
  left: 6px; 
}

.eye-slash::before { 
  content: ''; 
  position: absolute; 
  width: 18px; 
  height: 12px; 
  border: 2px solid #999; 
  border-radius: 18px; 
  top: 4px; 
  left: 1px; 
  opacity: 0.6; 
}

.eye-slash::after { 
  content: ''; 
  position: absolute; 
  width: 20px; 
  height: 2px; 
  background: #666; 
  top: 9px; 
  left: 0; 
  transform: rotate(-45deg); 
}
</style>