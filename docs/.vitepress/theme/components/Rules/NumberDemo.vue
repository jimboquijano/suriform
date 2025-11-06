<script setup>
import { onMounted } from 'vue'
import { watchForm, defineRules } from '../../../../../src/suriform'
import { numberRules } from '../../../../../src/rules'
import '../../../../../src/styles/suriform.css'

onMounted(() => {
  defineRules(numberRules)

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
          Integer
          <input type="text" integer />
          <small class="note">Rejects decimals and non-numeric values.</small>
        </label>

        <label>
          Numeric
          <input type="text" numeric />
          <small class="note">Rejects letters and special characters.</small>
        </label>
      </div>

      <div class="row">
        <label>
          5 digits
          <input type="text" digits="5" />
        </label>

        <label>
          Between 3 and 10
          <input type="text" between="3,10" />
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
