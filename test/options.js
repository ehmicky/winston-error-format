import test from 'ava'
import { each } from 'test-each'
import { shortFormat, fullFormat, validateOptions } from 'winston-error-format'

import { testError } from './helpers/main.js'

each(
  [
    true,
    { level: true },
    { level: 'unknown' },
    { stack: 'true' },
    { transform: true },
    { unknown: true },
  ],
  [shortFormat, fullFormat],
  ({ title }, options, format) => {
    test(`Format options are validated on format creation | ${title}`, (t) => {
      t.throws(format.bind(undefined, options))
    })

    test(`Format options are not validated on format creation if dynamic | ${title}`, (t) => {
      t.notThrows(format.bind(undefined, () => options))
    })

    test(`Format options are validated on format usage if dynamic | ${title}`, (t) => {
      t.throws(format(() => options).transform.bind(undefined, testError))
    })
  },
)

test('Can use validateOptions()', (t) => {
  t.throws(validateOptions.bind(undefined, { stack: 'true' }))
  t.notThrows(validateOptions.bind(undefined, { stack: true }))
})
