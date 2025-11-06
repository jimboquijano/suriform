<script setup>
import { onMounted } from 'vue'
import { watchForm } from '../../../../../src/suriform'
import { useAjax } from '../../../../../src/tools'
import '../../../../../src/styles/suriform.css'

onMounted(() => {
  const formEl = document.getElementById('formEl')
  const sf = watchForm(formEl, {
    validateOnSubmit: true,
    validateOnInput: true,
    stopOnFirstError: false
  })

  const ajax = useAjax(formEl)

  ajax.onSuccess((response) => {
    formEl.reset()
    alert('Triggered onSuccess()')
    console.log(response)
  })

  ajax.onError((error) => {
    formEl.reset()
    alert('Triggered onError()')
    console.log(error)
  })
})
</script>

<template>
  <div class="suriform container demo">
    <form
      class="card"
      id="formEl"
      autocomplete="off"
      action="https://jsonplaceholder.typicode.com/posts"
      method="POST"
    >
      <div class="row">
        <label>
          Name
          <input type="text" name="name" required />
        </label>

        <label>
          Job
          <input type="text" name="job" required />
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
