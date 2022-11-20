import test from 'ava'
import { each } from 'test-each'
import { shortFormat } from 'winston-error-format'

import { testError } from './helpers/main.js'

test('Does not use the stack if "stack" is false', (t) => {
  t.is(
    shortFormat({ stack: false }).transform(testError).message,
    `${testError.name}: ${testError.message}`,
  )
})

test('Use the stack by default', (t) => {
  t.is(shortFormat().transform(testError).message, testError.stack)
})

each(['name', 'message'], ({ title }, propName) => {
  test(`Use the prepended stack if "stack" is true and it misses the name or message | ${title}`, (t) => {
    const error = new Error('message')
    // TODO: use string.replaceAll() after dropping support for Node <15.0.0
    error.stack = error.stack.replace(new RegExp(error[propName], 'gu'), '')
    t.is(
      shortFormat().transform(error).message,
      `${error.name}: ${error.message}\n${error.stack}`,
    )
  })
})
