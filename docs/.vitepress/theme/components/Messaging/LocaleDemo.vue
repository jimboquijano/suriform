<script setup>
import { onMounted } from 'vue'
import { watchForm, defineRules, localize, setLocale } from '../../../../../src/suriform'
import { alphaRules } from '../../../../../src/rules'
import '../../../../../src/styles/suriform.css'
import en from '../../../../public/locale/en.json'
import fr from '../../../../public/locale/fr.json'

onMounted(() => {
  defineRules(alphaRules)
  localize({ en, fr })

  const formEl = document.getElementById('formEl')
  const sf = watchForm(formEl, {
    validateOnSubmit: true,
    validateOnInput: true,
    stopOnFirstError: false
  })

  document.getElementById('localechange').addEventListener('change', (e) => {
    console.log(e.target.value)
    setLocale(e.target.value, formEl)
  })
})
</script>

<template>
  <div class="suriform container demo">
    <form class="card" id="formEl" autocomplete="off">
      <label>
        Switch Locale:

        <select id="localechange">
          <option>en</option>
          <option>fr</option>
        </select>
      </label>

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
