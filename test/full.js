import test from 'ava'
import { LEVEL } from 'triple-beam'
import { fullFormat } from 'winston-error-format'

import { defaultLevel, testError } from './helpers/main.js'

test('Use the stack by default', (t) => {
  t.is(fullFormat().transform(testError).stack, testError.stack)
})

test('Does not use the stack if "stack" is false', (t) => {
  t.false('stack' in fullFormat({ stack: false }).transform(testError))
})

test('"stack" option is deep', (t) => {
  const error = new Error('outer')
  error.prop = testError
  const object = fullFormat(({ message }) => ({
    stack: message !== 'outer',
  })).transform(error)
  t.is(object.stack, undefined)
  t.is(object.prop.stack, error.prop.stack)
})

test('"transform" option modifies the error', (t) => {
  t.is(
    fullFormat({
      transform: ({ message }) => new Error(`transformed ${message}`),
    }).transform(testError).message,
    `transformed ${testError.message}`,
  )
})

test('Serializes error', (t) => {
  t.deepEqual(fullFormat().transform(testError), {
    level: defaultLevel,
    [LEVEL]: defaultLevel,
    name: testError.name,
    message: testError.message,
    stack: testError.stack,
  })
})

test('Serializes error properties', (t) => {
  const error = new Error('test')
  error.prop = true
  t.true(fullFormat().transform(error).prop)
})

test('Ignore JSON-unsafe error properties', (t) => {
  const error = new Error('test')
  error.prop = 0n
  t.false('prop' in fullFormat().transform(error))
})

test('Serializes error properties deeply', (t) => {
  const error = new Error('test')
  error.prop = testError
  t.is(fullFormat().transform(error).prop.message, testError.message)
})

test('Serializes aggregate errors deeply', (t) => {
  const error = new Error('test')
  error.errors = [testError]
  t.is(fullFormat().transform(error).errors[0].message, error.errors[0].message)
})
