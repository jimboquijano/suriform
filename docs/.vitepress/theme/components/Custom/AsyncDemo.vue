<script setup>
import { ref, onMounted } from 'vue'
import { watchForm, defineRule } from '../../../../../src/suriform'
import '../../../../../src/styles/suriform.css'

const formEl = ref(null)

onMounted(() => {
  defineRule('username', {
    async validate(value) {
      const res = await fetch(`https://dummyjson.com/users/search?q=${encodeURIComponent(value)}`)
      const data = await res.json()
      return data.users.length > 0
    },
    message: 'This username is already taken.'
  })

  const sf = watchForm(formEl.value, {
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
        <input type="text" name="username" username required />
      </label>

      <div class="actions">
        <button type="submit">Submit Form</button>
        <button type="button" class="secondary" onclick="this.form.reset()">Reset</button>
      </div>
    </form>
  </div>
</template>
