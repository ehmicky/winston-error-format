import test from 'ava'
import { serialize } from 'error-serializer'
import { each } from 'test-each'
import through from 'through2'
import { MESSAGE } from 'triple-beam'
import { createLogger, transports, format } from 'winston'
import { shortFormat, fullFormat } from 'winston-error-format'

import { testError, defaultLevel, testLevel } from './helpers/main.js'

const shortLog = function (value, options) {
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
  logger.error(value)
  return lastLog
}

const fullLog = function (value, options) {
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
  logger.error(value)
  return lastLog
}

test('Log stack-less errors with shortFormat', (t) => {
  t.is(
    shortLog(testError, { stack: false, level: testLevel }),
    `${testLevel}: ${testError.name}: ${testError.message}`,
  )
})

test('Log stack-less errors with fullFormat', (t) => {
  t.deepEqual(fullLog(testError, { stack: false, level: testLevel }), {
    level: testLevel,
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

each([shortFormat, fullFormat], ({ title }, specificFormat) => {
  test(`Sets level to error by default | ${title}`, (t) => {
    t.is(specificFormat().transform(testError).level, defaultLevel)
  })

  test(`Can set other level | ${title}`, (t) => {
    t.is(
      specificFormat({ level: testLevel }).transform(testError).level,
      testLevel,
    )
  })
})
