<script setup>
import { onMounted } from 'vue'
import { watchForm, defineRules } from '../../../../../src/suriform'
import { compareRules, strong } from '../../../../../src/rules'
import '../../../../../src/styles/suriform.css'

onMounted(() => {
  const nice = {
    message: '( ͡° ͜ʖ ͡°)ﾉ⌐■-■  NICE!',
    validate: (value) => {
      return value == 'sixty9' ? false : true
    }
  }

  defineRules({ nice, strong, ...compareRules })

  const formEl = document.getElementById('formEl')
  const sf = watchForm(formEl, {
    validateOnSubmit: true,
    validateOnInput: true,
    stopOnFirstError: false
  })
})
</script>

<template>
  <div class="suriform container demo">
    <form class="card" id="formEl" autocomplete="off">
      <div class="row">
        <label>
          Match sixty7
          <input type="text" name="match" match="sixty7" nice required />
        </label>

        <label>
          Not match sixty7
          <input type="text" name="unmatch" unmatch="sixty7" required />
        </label>
      </div>

      <div class="row">
        <label>
          Greater than 100
          <input type="number" name="greater" greater="100" required />
        </label>

        <label>
          Less than 10
          <input type="number" name="less" less="10" required />
        </label>
      </div>

      <div class="row">
        <label>
          Greater or equal than 5
          <input type="number" name="gequal" greater-equal="5" required />
        </label>

        <label>
          Less or equal than 50
          <input type="number" name="lequal" less-equal="50" required />
        </label>
      </div>

      <label>
        Passwords must match
        <div class="row">
          <div>
            <input
              type="password"
              name="password1"
              confirm="password2"
              required
              strong
              placeholder="password"
            />
          </div>
          <div>
            <input type="password" name="password2" required placeholder="confirm password" />
          </div>
        </div>
      </label>

      <label>
        Match the target value
        <div class="row">
          <div><input type="text" name="match" match-with="matchRef" nice required /></div>
          <div><input type="text" name="matchRef" value="sixty7" /></div>
        </div>
      </label>

      <label>
        Not match the target value
        <div class="row">
          <div><input type="text" name="unmatch" unmatch-with="unmatchRef" required /></div>
          <div><input type="text" name="unmatchRef" value="sixty7" /></div>
        </div>
      </label>

      <label>
        Greater than the target value
        <div class="row">
          <div><input type="number" name="greater" greater-than="greaterRef" required /></div>
          <div><input type="number" name="greaterRef" value="100" /></div>
        </div>
      </label>

      <label>
        Less than the target value
        <div class="row">
          <div><input type="number" name="less" less-than="lessRef" required /></div>
          <div><input type="number" name="lessRef" value="10" /></div>
        </div>
      </label>

      <label>
        Greater or equal to the target value
        <div class="row">
          <div>
            <input type="number" name="gequal" greater-equal-to="gequalRef" required />
          </div>
          <div><input type="number" name="gequalRef" value="5" /></div>
        </div>
      </label>

      <label>
        Less or equal to the target value
        <div class="row">
          <div><input type="number" name="lequal" less-equal-to="lequalRef" required /></div>
          <div><input type="number" name="lequalRef" value="50" /></div>
        </div>
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
