import test from 'ava'
import { each } from 'test-each'
import { LEVEL } from 'triple-beam'

import { defaultLevel, testError } from './helpers/main.test.js'

import { fullFormat } from 'winston-error-format'

test('Use the stack by default', (t) => {
  t.is(fullFormat().transform(testError).stack, testError.stack)
})

test('Does not use the stack if "stack" is false', (t) => {
  t.false('stack' in fullFormat({ stack: false }).transform(testError))
})

const isInnerErrorOptions = ({ message }) => ({ stack: message !== 'outer' })

test('"stack" option is deep', (t) => {
  const error = new Error('outer')
  error.prop = testError
  const object = fullFormat(isInnerErrorOptions).transform(error)
  t.is(object.stack, undefined)
  t.is(object.prop.stack, error.prop.stack)
})

each(
  [({ message }) => `${message}.`, ({ message }) => new Error(`${message}.`)],
  ({ title }, transform) => {
    test(`"transform" option is applied | ${title}`, (t) => {
      t.is(
        fullFormat({ transform }).transform(testError).message,
        `${testError.message}.`,
      )
    })
  },
)

test('"transform" option is applied deeply', (t) => {
  const outerError = new Error('outer')
  // eslint-disable-next-line fp/no-mutation
  outerError.prop = testError
  t.is(
    fullFormat({
      transform(error) {
        return error === outerError ? error : new Error('inner')
      },
    }).transform(outerError).prop.message,
    'inner',
  )
})

test('"transform" option is applied only once', (t) => {
  t.is(
    fullFormat({
      transform(error) {
        error.message += '.'
        return error
      },
    }).transform(new Error(testError.message)).message,
    `${testError.message}.`,
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

test('Avoid infinite recursion', (t) => {
  const error = new Error('test')
  error.prop = error
  error.errors = [error]
  const { prop, errors } = fullFormat().transform(error)
  t.is(prop, undefined)
  t.is(errors.length, 0)
})
