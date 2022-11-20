import { serialize } from 'error-serializer'
import isErrorInstance from 'is-error-instance'
import isPlainObj from 'is-plain-obj'
import safeJsonValue from 'safe-json-value'

import { applyOptions } from './options.js'

// The full format sets `level` and all error properties.
// It recurses on `errors` and additional properties.
// It is meant for transports which operates on objects like `http`.
export const toFullLogObject = function ({ error, level, options }) {
  const object = serializeValue(error, [], options)
  return { ...object, level }
}

const serializeValue = function (value, parents, options) {
  const parentsA = [...parents, value]
  const valueA = serializeError(value, options)
  const valueB = serializeRecurse(valueA, parentsA, options)
  const valueC = safeJsonValue(valueB, { shallow: true }).value
  return valueC
}

const serializeError = function (value, options) {
  if (!isErrorInstance(value)) {
    return value
  }

  const { stack: stackOpt, error } = applyOptions(value, options)
  const object = serialize(error, { shallow: true })

  if (stackOpt) {
    return object
  }

  // eslint-disable-next-line no-unused-vars
  const { stack, ...objectA } = object
  return objectA
}

const serializeRecurse = function (value, parents, options) {
  if (Array.isArray(value)) {
    return value
      .filter((child) => !parents.includes(child))
      .map((child) => serializeValue(child, parents, options))
  }

  if (isPlainObj(value)) {
    return Object.fromEntries(
      Object.keys(value)
        .filter((propName) => !parents.includes(value[propName]))
        .map((propName) => [
          propName,
          serializeValue(value[propName], parents, options),
        ]),
    )
  }

  return value
}
