<script setup>
import { ref, onMounted } from 'vue'
import { watchForm, defineRules } from '../../../../../src/suriform'
import { fileRules } from '../../../../../src/rules'
import '../../../../../src/styles/suriform.css'

const formEl = ref(null)

onMounted(() => {
  defineRules(fileRules)

  const sf = watchForm(formEl.value, {
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
          Extension (.ext .txt, .md only)
          <input type="file" name="doc" ext=".ext,.txt,.md" required multiple />
          <small class="note">Allowed: .ext, .txt, .md</small>
        </label>

        <label>
          MIME (only png)
          <input type="file" name="pngonly" mimes="image/png" required />
          <small class="note">MIME check example</small>
        </label>
      </div>

      <div class="row">
        <label>
          Min dimension of 200x200
          <input type="file" name="minimg" image min-width="200" min-height="200" required />
        </label>

        <label>
          Max dimension of 1200x1200
          <input type="file" name="maximg" image max-width="1200" max-height="1200" required />
        </label>
      </div>

      <div class="row">
        <label>
          Max size of 300KB
          <input type="file" name="sizeimg" image max-size="307200" required />
        </label>

        <label>
          JPG, min 200x200, max 1200x1200, max-size 300KB
          <input
            type="file"
            name="imgall"
            image
            mimes="image/jpg"
            min-width="200"
            min-height="200"
            max-width="1200"
            max-height="1200"
            max-size="307200"
            required
          />
        </label>
      </div>

      <div class="actions">
        <button type="submit">Submit Form</button>
        <button type="button" class="secondary" onclick="this.form.reset()">Reset</button>
      </div>
    </form>
  </div>
</template>
