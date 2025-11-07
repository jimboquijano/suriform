<script setup>
import { ref, onMounted } from 'vue'
import { watchForm } from '../../../../../src/suriform'
import { useAjax } from '../../../../../src/tools'
import '../../../../../src/styles/suriform.css'

const formEl = ref(null)

onMounted(() => {
  const sf = watchForm(formEl.value, {
    validateOnInput: true,
    stopOnFirstError: false
  })

  const ajax = useAjax(formEl.value)

  ajax.onSuccess((response) => {
    formEl.value.reset()
    alert('Triggered onSuccess()')
    console.log(response)
  })

  ajax.onError((error) => {
    formEl.value.reset()
    alert('Triggered onError()')
    console.log(error)
  })
})
</script>

<template>
  <div class="suriform container demo">
    <form
      class="card"
      ref="formEl"
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
        <button type="button" class="secondary" onclick="this.form.reset()">Reset</button>
      </div>
    </form>
  </div>
</template>
