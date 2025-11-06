import { defineRule, validateForm } from '../src/suriform'
import { maxlength, minlength } from '../src/rules'

window.addEventListener('DOMContentLoaded', async () => {
  const logEl = document.getElementById('log')
  const appendLog = (msg) => (logEl.innerHTML += msg + '<br>')

  const FIELD_COUNTS = [1000]
  const ITERATIONS = 5

  const createForm = (count) => {
    const form = document.createElement('form')
    form.noValidate = true

    for (let i = 1; i <= count; i++) {
      const input = document.createElement('input')
      input.name = `field${i}`
      input.type = 'number'
      input.required = true
      input.value = '22'
      input.setAttribute('minlength', '3')
      input.setAttribute('maxlength', '10')
      form.appendChild(input)
    }

    // Add submit button
    const submitButton = document.createElement('button')
    submitButton.type = 'submit'
    submitButton.textContent = 'Run Benchmark'
    form.appendChild(submitButton)

    document.body.appendChild(form)
    return form
  }

  const removeForm = (form) => form.remove()

  async function benchmarkJustValidate(count) {
    try {
      const v = new window.JustValidate(form)

      for (let i = 1; i <= count; i++) {
        v.addField(`[name="field${i}"]`, [
          { rule: 'required' },
          { rule: 'minLength', value: 3 },
          { rule: 'maxLength', value: 10 }
        ])
      }

      // Mark all fields as touched/dirty by simulating input and blur
      form.querySelectorAll('input').forEach((input) => {
        //input.dispatchEvent(new Event('input', { bubbles: true }))
        //input.dispatchEvent(new Event('blur', { bubbles: true }))
      })

      const times = []
      for (let i = 0; i < ITERATIONS; i++) {
        const start = performance.now()
        await v.revalidate()
        const end = performance.now()
        times.push(end - start)
      }

      const avg = times.reduce((a, b) => a + b, 0) / times.length
      appendLog(`JustValidate - ${count} fields: Avg ${avg.toFixed(3)} ms`)

      removeForm(form)
    } catch (e) {
      appendLog(`❌ JustValidate failed: ${e.message}`)
    }
  }

  window.Parsley.options.errorsWrapper = '' // no wrapper
  window.Parsley.options.errorTemplate = ''

  async function benchmarkParsley(count) {
    try {
      // Mark all fields as touched/dirty by simulating input and blur
      form.querySelectorAll('input').forEach((input) => {
        //input.dispatchEvent(new Event('input', { bubbles: true }))
        //input.dispatchEvent(new Event('blur', { bubbles: true }))
      })

      const times = []
      for (let i = 0; i < ITERATIONS; i++) {
        const form = createForm(count)
        const parsleyInstance = $(form).parsley()

        const start = performance.now()
        parsleyInstance.validate()
        const end = performance.now()
        times.push(end - start)

        removeForm(form)
      }

      const avg = times.reduce((a, b) => a + b, 0) / times.length
      appendLog(`Parsley.js - ${count} fields: Avg ${avg.toFixed(3)} ms`)
    } catch (e) {
      appendLog(`❌ Parsley.js failed: ${e.message}`)
    }
  }

  defineRule('minlength', minlength)
  defineRule('maxlength', maxlength)

  async function benchmarkSuriform(count) {
    try {
      form.__sfInline = false

      const times = []
      for (let i = 0; i < ITERATIONS; i++) {
        const start = performance.now()
        await validateForm(form, false)
        const end = performance.now()
        times.push(end - start)
      }

      const avg = times.reduce((a, b) => a + b, 0) / times.length
      appendLog(`Suriform - ${count} fields: Avg ${avg.toFixed(3)} ms`)

      removeForm(form)
    } catch (e) {
      appendLog(`❌ Suriform failed: ${e.message}`)
    }
  }

  const form = createForm(FIELD_COUNTS[0])
  appendLog('Starting benchmark...<br>')
  for (const n of FIELD_COUNTS) {
    await benchmarkJustValidate(n)
    await benchmarkParsley(n)
    await benchmarkSuriform(n)
  }
  appendLog('<br>✅ Benchmark complete.')

  // Only run benchmark on submit button click
  /*
  form.addEventListener('submit', async (e) => {
    e.preventDefault() // prevent actual form submission
    appendLog('Starting benchmark...<br>')
    for (const n of FIELD_COUNTS) {
      await benchmarkJustValidate(n)
	  await benchmarkParsley(n)
      await benchmarkSuriform(n)
    }
    appendLog('<br>✅ Benchmark complete.')
  })
  */
})
