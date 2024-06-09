import { serialize } from 'error-serializer'
import isErrorInstance from 'is-error-instance'
import isPlainObj from 'is-plain-obj'
import safeJsonValue from 'safe-json-value'

import { applyOptions } from './options.js'

// The full format sets `level` and all error properties.
// It recurses on `errors` and additional properties.
// It is meant for transports which operates on objects like `http`.
export const toFullLogObject = (error, level, options) => {
  const object = serializeValue({ value: error, parents: [], level, options })
  const { level: levelA } = applyOptions(error, level, options)
  return { ...object, level: levelA }
}

const serializeValue = ({ value, parents, level, options }) => {
  const parentsA = [...parents, value]
  const valueA = serializeError(value, level, options)
  const valueB = serializeRecurse({
    value: valueA,
    parents: parentsA,
    level,
    options,
  })
  const valueC = safeJsonValue(valueB, { shallow: true }).value
  return valueC
}

const serializeError = (value, level, options) => {
  if (!isErrorInstance(value)) {
    return value
  }

  const { stack: stackOpt, error } = applyOptions(value, level, options)
  const exclude = stackOpt ? undefined : ['stack']
  return serialize(error, { shallow: true, exclude })
}

const serializeRecurse = ({ value, parents, level, options }) => {
  if (Array.isArray(value)) {
    return value
      .filter((child) => !parents.includes(child))
      .map((child) => serializeValue({ value: child, parents, level, options }))
  }

  if (isPlainObj(value)) {
    return Object.fromEntries(
      Object.keys(value)
        .filter((propName) => !parents.includes(value[propName]))
        .map((propName) => [
          propName,
          serializeValue({ value: value[propName], parents, level, options }),
        ]),
    )
  }

  return value
}
