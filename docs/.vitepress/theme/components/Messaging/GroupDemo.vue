<script setup>
import { onMounted } from 'vue'
import { watchForm, defineRules } from '../../../../../src/suriform'
import { extendMessage } from '../../../../../src/tools'
import { fileRules } from '../../../../../src/rules'
import '../../../../../src/styles/suriform.css'

onMounted(() => {
  defineRules(fileRules)

  const formEl = document.getElementById('formEl')
  const sf = watchForm(formEl, {
    validateOnSubmit: true,
    validateOnInput: true,
    stopOnFirstError: false
  })

  const ext = extendMessage(formEl)

  ext.groupMessage({
    rules: ['min-width', 'min-height', 'max-width', 'max-height'],
    message: 'Image must be of correct size.'
  })
})
</script>

<template>
  <div class="suriform container demo">
    <form class="card" id="formEl" autocomplete="off">
      <label>
        Size: min 200x200, max 1200x1200, max-size 300KB
        <input
          type="file"
          name="imgall"
          image
          min-width="200"
          min-height="200"
          max-width="1200"
          max-height="1200"
          max-size="307200"
          required
        />
      </label>

      <div class="actions">
        <button type="submit">Submit Form</button>
        <button type="button" class="secondary" onclick="document.getElementById('formEl').reset()">
          Reset
        </button>
      </div>
    </form>
  </div>
</template>
