<script setup>
import { onMounted } from 'vue'
import { watchForm, defineRule } from '../../../../../src/suriform'
import { watchTarget } from '../../../../../src/tools'
import '../../../../../src/styles/suriform.css'

onMounted(() => {
  defineRule('match', {
    validate: (value, [target], { form }) => {
      return value == form[target]
    },
    checksTarget: true,
    message: 'Fields do not match.'
  })

  const formEl = document.getElementById('formEl')
  const sf = watchForm(formEl, {
    validateOnSubmit: true,
    validateOnInput: true,
    stopOnFirstError: false
  })

  const watcher = watchTarget(formEl, [{ foo: 'bar' }])
})
</script>

<template>
  <div class="suriform container demo">
    <form class="card" id="formEl" autocomplete="off">
      <div class="row">
        <label>
          Match this:
          <input type="text" name="foo" match="bar" />
        </label>

        <label>
          With this:
          <input type="text" name="bar" />
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
