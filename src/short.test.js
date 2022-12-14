import test from 'ava'
import { each } from 'test-each'

import { testError } from './helpers/main.test.js'

import { shortFormat } from 'winston-error-format'

test('Use the stack by default', (t) => {
  t.is(shortFormat().transform(testError).message, testError.stack)
})

test('Does not use the stack if "stack" is false', (t) => {
  t.is(
    shortFormat({ stack: false }).transform(testError).message,
    `${testError.name}: ${testError.message}`,
  )
})

each(['name', 'message'], ({ title }, propName) => {
  test(`Use the prepended stack if it misses the name or message | ${title}`, (t) => {
    const error = new Error('message')
    // TODO: use string.replaceAll() after dropping support for Node <15.0.0
    error.stack = error.stack.replace(new RegExp(error[propName], 'gu'), '')
    t.is(
      shortFormat().transform(error).message,
      `${error.name}: ${error.message}\n${error.stack}`,
    )
  })
})

test('Can use dynamic options', (t) => {
  t.is(
    shortFormat(() => ({ stack: false })).transform(testError).message,
    `${testError.name}: ${testError.message}`,
  )
})

each(
  [({ message }) => new Error(`${message}.`), ({ message }) => `${message}.`],
  ({ title }, transform) => {
    const options = () => ({ stack: false, transform })

    test(`"transform" option is applied | ${title}`, (t) => {
      t.is(
        shortFormat(options).transform(testError).message,
        `${testError.name}: ${testError.message}.`,
      )
    })
  },
)
