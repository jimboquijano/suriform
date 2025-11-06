<script setup>
import { onMounted } from 'vue'
import { watchForm, defineRules } from '../../../../../src/suriform'
import { selectRules } from '../../../../../src/rules'
import '../../../../../src/styles/suriform.css'

onMounted(() => {
  defineRules(selectRules)

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
          Mininum of 2 options
          <select min-select="2" required multiple size="5">
            <option>Apple</option>
            <option>Banana</option>
            <option>Orange</option>
            <option>Mango</option>
            <option>Watermelon</option>
          </select>
        </label>

        <label>
          Maximum of 2 options
          <select max-select="2" required multiple size="5">
            <option>Apple</option>
            <option>Banana</option>
            <option>Orange</option>
            <option>Mango</option>
            <option>Watermelon</option>
          </select>
        </label>
      </div>

      <div class="row">
        <label>
          Allowed: Banana & Mango
          <select allowed="Banana,Mango" required multiple size="5">
            <option>Apple</option>
            <option>Banana</option>
            <option>Orange</option>
            <option>Mango</option>
            <option>Watermelon</option>
          </select>
        </label>

        <label>
          Forbidden: Apple & Orange
          <select forbidden="Apple,Orange" required multiple size="5">
            <option>Apple</option>
            <option>Banana</option>
            <option>Orange</option>
            <option>Mango</option>
            <option>Watermelon</option>
          </select>
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
