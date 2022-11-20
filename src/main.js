import isErrorInstance from 'is-error-instance'
import { format } from 'logform'
import { LEVEL, MESSAGE } from 'triple-beam'

import { toFullLogObject } from './full.js'
import { validateOptions, DEFAULT_LEVEL } from './options.js'
import { toShortLogObject } from './short.js'

export { validateOptions }

// Retrieve each Winston format.
// We do not include any logic that is already available in default formats
// like `json`, `prettyPrint`, `simple` or `cli`.
const getFormat = function (method, options) {
  if (options !== undefined && typeof options !== 'function') {
    validateOptions(options)
  }

  return format(formatFunc.bind(undefined, method, options))()
}

const formatFunc = function (method, options, value) {
  if (!isErrorInstance(value)) {
    return value
  }

  const { level = DEFAULT_LEVEL } = value
  deleteWinstonProps(value)
  const object = method(value, level, options)
  return { ...object, [LEVEL]: object.level }
}

// Winston directly mutates `log()` argument, which we remove
const deleteWinstonProps = function (value) {
  WINSTON_PROPS.forEach((propName) => {
    // eslint-disable-next-line fp/no-delete, no-param-reassign
    delete value[propName]
  })
}

const WINSTON_PROPS = ['level', LEVEL, MESSAGE]

export const shortFormat = getFormat.bind(undefined, toShortLogObject)
export const fullFormat = getFormat.bind(undefined, toFullLogObject)
