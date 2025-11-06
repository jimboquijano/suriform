<script setup>
import { onMounted } from 'vue'
import { watchForm, defineRules } from '../../../../../src/suriform'
import { nativeRules } from '../../../../../src/rules'
import '../../../../../src/styles/suriform.css'

onMounted(() => {
  defineRules(nativeRules)

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
      <div class="row">
        <label>
          Email
          <input type="email" required />
        </label>

        <label>
          URL
          <input type="url" required />
        </label>
      </div>

      <div class="row">
        <label>
          Mininum of 5
          <input type="number" min="5" required />
        </label>

        <label>
          Maximum of 5
          <input type="number" max="5" required />
        </label>
      </div>

      <div class="row">
        <label>
          Mininum length of 5
          <input type="text" minlength="5" required />
        </label>

        <label>
          Maximum length of 5
          <input type="text" maxlength="5" required />
        </label>
      </div>

      <div class="row">
        <label>
          Mininum of 5, increments of 2
          <input type="number" min="5" step="2" required />
        </label>

        <label>
          3-letter code (A–Z)
          <input type="text" pattern="^[A-Z]{3}$" required />
        </label>
      </div>

      <div class="actions">
        <button type="submit">Submit Form</button>
        <button type="button" class="secondary" onclick="document.getElementById('formEl').reset()">
          Reset
        </button>
      </div>
    </form>
  </div>
</template>
