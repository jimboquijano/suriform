<script setup>
import { ref, onMounted } from 'vue'
import { watchForm, defineRules } from '../../../../../src/suriform'
import { watchTarget } from '../../../../../src/tools'
import { requiredRules } from '../../../../../src/rules'
import '../../../../../src/styles/suriform.css'

const formEl = ref(null)

onMounted(() => {
  defineRules(requiredRules)

  const sf = watchForm(formEl.value, {
    validateOnSubmit: true,
    validateOnInput: true,
    stopOnFirstError: false
  })

  const watcher = watchTarget(formEl.value, [
    { reqif: ['reqifRef'] },
    { requn: ['requnRef'] },
    { reqwith: ['reqwithRef'] },
    { withall: ['withallRefA', 'withallRefB'] }
  ])
})
</script>

<template>
  <div class="suriform container demo">
    <form class="card" ref="formEl" autocomplete="off">
      <div class="row">
        <div class="row row-toggle">
          <label>
            Required if the toggle is checked
            <input type="text" name="reqif" required-if="reqifRef:on" />
          </label>

          <label>&nbsp; <input type="checkbox" name="reqifRef" /></label>
        </div>

        <div class="row row-toggle">
          <label>
            Required unless the toggle is checked
            <input type="text" name="requn" required-unless="requnRef:on" />
          </label>

          <label>&nbsp; <input type="checkbox" name="requnRef" /></label>
        </div>
      </div>

      <div class="row">
        <div>
          <label>
            Required if target below has value
            <input type="text" name="reqwith" required-with="reqwithRef" />
          </label>

          <label>
            Target
            <input type="text" name="reqwithRef" />
          </label>
        </div>

        <div>
          <label>
            Required if targets below has values
            <input type="text" name="withall" required-with-all="withallRefA,withallRefB" />
          </label>

          <div class="row">
            <label>
              Target A
              <input type="text" name="withallRefA" />
            </label>

            <label>
              Target B
              <input type="text" name="withallRefB" />
            </label>
          </div>
        </div>
      </div>

      <div class="actions">
        <button type="submit">Submit Form</button>
        <button type="button" class="secondary" onclick="this.form.reset()">Reset</button>
      </div>
    </form>
  </div>
</template>
