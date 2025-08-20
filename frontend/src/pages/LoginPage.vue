<template>
  <FormWrapper title="Login">
    <template v-if="checkedLogin">
      <form v-if="!isLoggedIn" @submit.prevent="login">
        <div class="form-group">
          <input
            v-model="state.username"
            type="text"
            placeholder="Username"
            class="form-input"
          />
          <div v-if="v$.username.$dirty && v$.username.$error" class="text-danger">
            Username is required
          </div>
        </div>

        <div class="form-group password-wrapper">
          <input
            v-model="state.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Password"
            class="form-input"
          />
          <div
            :class="['toggle-password-icon', showPassword ? 'eye-slash' : 'eye']"
            @click="showPassword = !showPassword"
          ></div>
          <div v-if="v$.password.$dirty && v$.password.$error" class="text-danger">
            <span v-if="v$.password.$errors.find(e => e.$validator === 'required')">Field is required</span>
            <span v-if="v$.password.$errors.find(e => e.$validator === 'minLength')">
              Password must be at least 6 characters long
            </span>
          </div>
        </div>

        <div v-if="alreadyLoggedInMessage" class="text-info">
          {{ alreadyLoggedInMessage }}
        </div>

        <BaseButton type="login" htmlType="submit" class="mt-2">Login</BaseButton>

        <div v-if="loginSuccess" class="text-success" style="margin-top:0.5rem;">
          Logged in successfully!
        </div>
        <div v-if="loginFailed" class="text-danger" style="margin-top:0.5rem;">
          ⚠️ {{ serverError || 'Something went wrong. Try again' }}
        </div>
      </form>

      <div v-else class="already-logged-in-message">
        {{ alreadyLoggedInMessage || 'You are already logged in' }}
      </div>

      <p>
        Don't have an account?
        <BaseButton type="link" @click="$emit('toggle-auth')">
          Sign up
        </BaseButton>
      </p>

    </template>
  </FormWrapper>
</template>

<script>
import { reactive, ref, onMounted, getCurrentInstance, watch } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength } from '@vuelidate/validators';
import FormWrapper from "@/components/FormWrapper.vue";
import { useRouter } from 'vue-router';
import BaseButton from "@/components/BaseButton.vue";


export default {
  name: "LoginPage",
  components: { FormWrapper, BaseButton },
  setup(_, { expose }) {
    const { proxy } = getCurrentInstance();
    const router = useRouter();

    const state = reactive({
      username: '',
      password: '',
    });

    const v$ = useVuelidate({
      username: { required },
      password: { required, minLength: minLength(6) },
    }, state);

    const showPassword = ref(false);
    const serverError = ref('');
    const alreadyLoggedInMessage = ref('');
    const loginSuccess = ref(false);
    const loginFailed = ref(false);
    const isLoggedIn = ref(false);
    const checkedLogin = ref(false); 

    watch(() => state.username, () => serverError.value = '');
    watch(() => state.password, () => serverError.value = '');

    const login = async () => {
      v$.value.$touch();
      serverError.value = '';

      if (await v$.value.$validate()) {
        try {
          const response = await proxy.axios.post('/auth/login', {
            username: state.username,
            password: state.password
          });

          if (response.status === 200) {
            proxy.store.login(state.username);
            loginSuccess.value = true;
            setTimeout(() => router.push('/'), 1500);
          } else {
            serverError.value = `Login failed – unexpected status (${response.status})`;
            loginFailed.value = true;
            setTimeout(() => loginFailed.value = false, 3000);
          }

        } catch (err) {
          loginSuccess.value = false;
          const status = err.response?.status;
          const backendMessage = (err.response?.data?.message || '').toLowerCase();

          if (status === 401) {
            serverError.value = 'Incorrect username or password';
          } else if (status === 500) {
            serverError.value = 'Server error – please try again later';
          } else if (backendMessage) {
            serverError.value = backendMessage;
          } else {
            serverError.value = `Unknown error (${status || '??'})`;
          }

          loginFailed.value = true;
          setTimeout(() => loginFailed.value = false, 3000);
        }
      }
    };

    onMounted(async () => {
      try {
        const res = await proxy.axios.get('/users/me');
        if (res.status === 200 && res.data?.username) {
          isLoggedIn.value = true;
          alreadyLoggedInMessage.value = `Already logged in as ${res.data.username}`;

          proxy.store.login(res.data.username);
          setTimeout(() => router.push('/'), 2000);
        }
      } catch (err) {
        console.debug("User is not logged in yet");
      } finally {
        checkedLogin.value = true;
      }
    });

    expose({ login });

    return {
      state,
      v$,
      login,
      showPassword,
      serverError,
      alreadyLoggedInMessage,
      loginSuccess,
      loginFailed,
      isLoggedIn,
      checkedLogin
    };
  }
};
</script>

<style scoped>
.form-input {
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  box-sizing: border-box;
}

.text-danger {
  color: #dc3545;
  font-size: 0.9rem;
  margin-top: -0.5rem;
  margin-bottom: 0.75rem;
  text-align: left;
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

/* Eye icon - open eye */
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
  background-color: #666;
  border-radius: 50%;
  top: 6px;
  left: 6px;
}

/* Eye-slash icon - closed eye */
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
  background-color: #666;
  top: 9px;
  left: 0px;
  transform: rotate(-45deg);
}

.text-info {
  color: #007bff;
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
  text-align: left;
}

.text-success {
  color: #28a745;
  font-size: 0.9rem;
  text-align: center;
}

.text-fail {
  color: red;
  font-size: 0.9rem;
  text-align: center;
}

.already-logged-in-message {
  text-align: center;
  color: #28a745;
  font-size: 1rem;
  margin-top: 2rem;
  background-color: #e6f9ed;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #b4e0cb;
}
</style>