<script setup>
import { onMounted } from 'vue'
import { watchForm, defineRules } from '../../../../../src/suriform'
import { useValidity, withPopup } from '../../../../../src/tools'
import { alphaRules } from '../../../../../src/rules'
import '../../../../../src/styles/suriform.css'

onMounted(() => {
  defineRules(alphaRules)

  const formEl = document.getElementById('formEl')
  const sf = watchForm(formEl, {
    validateOnSubmit: true,
    validateOnInput: true,
    stopOnFirstError: false
  })

  const validity = useValidity(formEl)
  const popup = withPopup(formEl)

  validity.onInvalid(({ field, message }) => {
    popup.addError(field, message)
  })

  validity.onInvalid(({ field }) => {
    popup.removeError(field)
  })

  validity.onFail((errors) => {
    popup.addErrors(errors)
  })

  validity.onPass(() => {
    popup.removeErrors()
  })

  validity.onReset(() => {
    popup.removeErrors()
  })
})
</script>

<template>
  <div class="suriform container demo">
    <form class="card" id="formEl" autocomplete="off">
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
        <button type="button" class="secondary" onclick="document.getElementById('formEl').reset()">
          Reset
        </button>
      </div>
    </form>
  </div>
</template>
