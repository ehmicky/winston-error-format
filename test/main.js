import test from 'ava'
import winstonErrorFormat from 'winston-error-format'

test('Dummy test', (t) => {
  t.true(winstonErrorFormat(true))
})
