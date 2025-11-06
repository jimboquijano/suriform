<script setup>
import { ref, onMounted } from 'vue'
import { watchForm, defineRule } from '../../../../../src/suriform'
import '../../../../../src/styles/suriform.css'

const formEl = ref(null)

onMounted(() => {
  defineRule('username', {
    async validate(value) {
      if (!value) return true

      try {
        const res = await fetch(`https://dummyjson.com/users/search?q=${encodeURIComponent(value)}`)

        if (!res.ok) {
          return 'Could not verify username. Please try again later.'
        }

        const data = await res.json()

        if (!data.users.length) {
          return 'This username is already taken.'
        }

        return true
      } catch (err) {
        return 'Network error — please try again.'
      }
    },
    message: 'Invalid username.'
  })

  const sf = watchForm(formEl.value, {
    validateOnSubmit: true,
    validateOnInput: true,
    stopOnFirstError: false
  })
})
</script>

<template>
  <div class="suriform container demo">
    <form class="card" ref="formEl" autocomplete="off">
      <label>
        Username
        <input
          type="text"
          name="username"
          username
          required
          error-message="name|This is a message"
        />
      </label>

      <div class="actions">
        <button type="submit">Submit Form</button>
        <button type="button" class="secondary" onclick="this.form.reset()">Reset</button>
      </div>
    </form>
  </div>
</template>
