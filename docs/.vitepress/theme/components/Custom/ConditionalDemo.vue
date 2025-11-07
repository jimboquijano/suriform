<script setup>
import { ref, onMounted } from 'vue'
import { watchForm, defineRule } from '../../../../../src/suriform'
import { watchTarget } from '../../../../../src/tools'
import '../../../../../src/styles/suriform.css'

const formEl = ref(null)

onMounted(() => {
  defineRule('match', {
    validate: (value, [target], { form }) => {
      return value == form[target]
    },
    checksTarget: true,
    message: 'Fields do not match.'
  })

  const sf = watchForm(formEl.value, {
    validateOnInput: true,
    stopOnFirstError: false
  })

  const watcher = watchTarget(formEl.value, [{ foo: 'bar' }])
})
</script>

<template>
  <div class="suriform container demo">
    <form class="card" ref="formEl" autocomplete="off">
      <div class="row">
        <label>
          Match this:
          <input type="text" name="foo" match="bar" required />
        </label>

        <label>
          With this:
          <input type="text" name="bar" required />
        </label>
      </div>

      <div class="actions">
        <button type="submit">Submit Form</button>
        <button type="button" class="secondary" onclick="this.form.reset()">Reset</button>
      </div>
    </form>
  </div>
</template>
