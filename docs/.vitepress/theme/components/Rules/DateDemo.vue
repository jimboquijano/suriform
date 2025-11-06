<script setup>
import { ref, onMounted } from 'vue'
import { watchForm, defineRules } from '../../../../../src/suriform'
import { watchTarget } from '../../../../../src/tools'
import { dateRules } from '../../../../../src/rules'
import '../../../../../src/styles/suriform.css'

const formEl = ref(null)

onMounted(() => {
  defineRules(dateRules)

  const sf = watchForm(formEl.value, {
    validateOnSubmit: true,
    validateOnInput: true,
    stopOnFirstError: false
  })

  // prettier-ignore
  const watcher = watchTarget(formEl.value, [
    { bstartdate: 'benddate' },
    { aenddate: 'astartdate' }
  ])
})
</script>

<template>
  <div class="suriform container demo">
    <form class="card" ref="formEl" autocomplete="off">
      <div class="row">
        <label>
          Min date 2020-02-22
          <input type="date" name="mind" min-date="2020-02-22" required />
        </label>

        <label>
          Max date 2020-02-22
          <input type="date" name="maxd" max-date="2020-02-22" required />
        </label>
      </div>

      <div class="row">
        <label>
          Date between 2020-02-22 and 2022-02-22
          <input type="date" name="dbetween" date-between="2020-02-22,2022-02-22" required />
        </label>
      </div>

      <div class="row">
        <label>
          Start date must be before end date
          <input type="date" name="bstartdate" date-before="benddate" required />
        </label>

        <label>
          End date
          <input type="date" name="benddate" required />
        </label>
      </div>

      <div class="row">
        <label>
          Start date
          <input type="date" name="astartdate" required />
        </label>

        <label>
          End date must be after start date
          <input type="date" name="aenddate" date-after="astartdate" required />
        </label>
      </div>

      <div class="actions">
        <button type="submit">Submit Form</button>
        <button type="button" class="secondary" onclick="this.form.reset()">Reset</button>
      </div>
    </form>
  </div>
</template>
