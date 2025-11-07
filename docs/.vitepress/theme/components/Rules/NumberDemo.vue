<script setup>
import { ref, onMounted } from 'vue'
import { watchForm, defineRules } from '../../../../../src/suriform'
import { numberRules } from '../../../../../src/rules'
import '../../../../../src/styles/suriform.css'

const formEl = ref(null)

onMounted(() => {
  defineRules(numberRules)

  const sf = watchForm(formEl.value, {
    validateOnInput: true,
    stopOnFirstError: false
  })
})
</script>

<template>
  <div class="suriform container demo">
    <form class="card" ref="formEl" autocomplete="off">
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
        <button type="button" class="secondary" onclick="this.form.reset()">Reset</button>
      </div>
    </form>
  </div>
</template>
