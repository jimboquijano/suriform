<script setup>
import { ref, onMounted } from 'vue'
import { watchForm, defineRules } from '../../../../../src/suriform'
import { alphaRules } from '../../../../../src/rules'
import '../../../../../src/styles/suriform.css'

const formEl = ref(null)

onMounted(() => {
  defineRules(alphaRules)

  const sf = watchForm(formEl.value.value, {
    validateOnSubmit: true,
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
          Alpha (letters only)
          <input type="text" name="alpha" alpha required />
          <small class="note">Example: John</small>
        </label>

        <label>
          Alpha-dash (letters, - and _)
          <input type="text" name="aldash" alpha-dash required />
          <small class="note">Example: hello-world</small>
        </label>
      </div>

      <div class="row">
        <label>
          Alpha-num (letters and numbers)
          <input type="text" name="alnum" alpha-num required />
          <small class="note">Example: ABC123</small>
        </label>

        <label>
          Alpha-spaces (letters and spaces)
          <input type="text" name="alspaces" alpha-spaces required />
          <small class="note">Example: John Doe</small>
        </label>
      </div>

      <div class="row">
        <label>
          Alpha-num-spaces (letters, number & spaces)
          <input type="text" name="alnumspaces" alpha-num-spaces required />
          <small class="note">Example: John Doe 67</small>
        </label>
      </div>

      <div class="actions">
        <button type="submit">Submit Form</button>
        <button type="button" class="secondary" onclick="this.form.reset()">Reset</button>
      </div>
    </form>
  </div>
</template>
