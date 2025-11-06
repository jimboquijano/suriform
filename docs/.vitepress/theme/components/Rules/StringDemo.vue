<script setup>
import { onMounted } from 'vue'
import { watchForm, defineRules } from '../../../../../src/suriform'
import { stringRules } from '../../../../../src/rules'
import '../../../../../src/styles/suriform.css'

onMounted(() => {
  defineRules(stringRules)

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
          5 characters
          <input type="text" length="5" />
        </label>

        <label>
          Letters only (A–Z)
          <input type="text" regex="^[A-Za-z]+$" regex-flags="i" required />
        </label>
      </div>

      <div class="row">
        <label>
          Contains "abc"
          <input type="text" contains="abc" required />
        </label>

        <label>
          Not contains "abc"
          <input type="text" not-contains="abc" required />
        </label>
      </div>

      <div class="row">
        <label>
          One of "yes", "no" and "maybe"
          <input type="text" one-of="yes,no,maybe" required />
        </label>

        <label>
          Not one of "admin", "root" and "test"
          <input type="text" not-one-of="admin,root,test" required />
        </label>
      </div>

      <div class="row">
        <label>
          Between 3 to 10 characters
          <input type="text" between-char="3,10" required />
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
