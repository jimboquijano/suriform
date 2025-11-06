<script setup>
import { onMounted } from 'vue'
import { watchForm, defineRule } from '../../../../../src/suriform'
import '../../../../../src/styles/suriform.css'

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

  const formEl = document.getElementById('formEl')
  const sf = watchForm(formEl, {
    validateOnSubmit: true,
    validateOnInput: true,
    stopOnFirstError: false
  })
})
</script>

<template>
  <div class="suriform container demo">
    <form class="card" id="formEl" autocomplete="off">
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
        <button type="button" class="secondary" onclick="document.getElementById('formEl').reset()">
          Reset
        </button>
      </div>
    </form>
  </div>
</template>
