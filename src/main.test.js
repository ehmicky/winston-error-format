import test from 'ava'
import { serialize } from 'error-serializer'
import { each } from 'test-each'
import through from 'through2'
import { MESSAGE } from 'triple-beam'
import { createLogger, transports, format } from 'winston'

import { testError, defaultLevel, testLevel } from './helpers/main.test.js'

import { shortFormat, fullFormat } from 'winston-error-format'

const shortLog = (value, options, level = defaultLevel) => {
  // eslint-disable-next-line fp/no-let
  let lastLog = ''
  const stream = through.obj((object, encoding, done) => {
    // eslint-disable-next-line fp/no-mutation
    lastLog = object[MESSAGE]
    done(undefined, object)
  })
  const logger = createLogger({
    format: format.combine(shortFormat(options), format.simple()),
    transports: [new transports.Stream({ stream })],
  })
  logger[level](value)
  return lastLog
}

const fullLog = (value, options, level = defaultLevel) => {
  // eslint-disable-next-line fp/no-let
  let lastLog = {}
  const stream = through.obj((object, encoding, done) => {
    // eslint-disable-next-line fp/no-mutation
    lastLog = JSON.parse(object[MESSAGE])
    done(undefined, object)
  })
  const logger = createLogger({
    format: format.combine(fullFormat(options), format.json()),
    transports: [new transports.Stream({ stream })],
  })
  logger[level](value)
  return lastLog
}

test('Log stack-less errors with shortFormat', (t) => {
  t.is(
    shortLog(testError, { stack: false }),
    `${defaultLevel}: ${testError.name}: ${testError.message}`,
  )
})

test('Log stack-less errors with fullFormat', (t) => {
  t.deepEqual(fullLog(testError, { stack: false }), {
    level: defaultLevel,
    name: testError.name,
    message: testError.message,
  })
})

test('Log stack-full errors with shortFormat', (t) => {
  t.is(shortLog(testError), `${defaultLevel}: ${testError.stack}`)
})

test('Log stack-full errors with fullFormat', (t) => {
  t.deepEqual(fullLog(testError), {
    level: defaultLevel,
    name: testError.name,
    message: testError.message,
    stack: testError.stack,
  })
})

test('Log non-errors with shortFormat', (t) => {
  const message = 'test'
  t.is(shortLog(message), `${defaultLevel}: ${message}`)
})

test('Log non-errors with fullFormat', (t) => {
  const message = 'test'
  t.deepEqual(fullLog(message), { level: defaultLevel, message })
})

test('Keep level by default with shortFormat', (t) => {
  t.true(shortLog(testError, {}, testLevel).startsWith(testLevel))
})

test('Keep level by default with fullFormat', (t) => {
  t.is(fullLog(testError, {}, testLevel).level, testLevel)
})

test('Can override level with shortFormat', (t) => {
  t.true(shortLog(testError, { level: testLevel }).startsWith(testLevel))
})

test('Can override level with fullFormat', (t) => {
  t.is(fullLog(testError, { level: testLevel }).level, testLevel)
})

each([shortLog, fullLog], ({ title }, doLog) => {
  test(`Does not modify error | ${title}`, (t) => {
    const error = new Error('test')
    const keysBefore = Reflect.ownKeys(error)
    const valuesBefore = serialize(error)

    doLog(error, { level: testLevel })

    const keysAfter = Reflect.ownKeys(error)
    const valuesAfter = serialize(error)
    t.deepEqual(keysBefore, keysAfter)
    t.deepEqual(valuesBefore, valuesAfter)
  })
})
