import { applyOptions } from './options.js'

// The short format only sets `level` and `message`.
// It only uses `name`, `message` and `stack`.
// `errors` and additional properties are ignored.
// It is meant for transports which operates on strings like `console`.
// We make sure to return new objects since `logform` directly mutates.
export const toShortLogObject = function (error, level, options) {
  const {
    level: levelA,
    stack,
    error: errorA,
  } = applyOptions(error, level, options)
  const message = getShortMessage(errorA, stack)
  return { level: levelA, message }
}

const getShortMessage = function ({ name, message, stack }, stackOpt) {
  if (!stackOpt) {
    return `${name}: ${message}`
  }

  return stack.includes(name) && stack.includes(message)
    ? stack
    : `${name}: ${message}\n${stack}`
}
