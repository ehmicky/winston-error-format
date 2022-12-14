import isPlainObj from 'is-plain-obj'
import normalizeException from 'normalize-exception'
import { configs } from 'triple-beam'

// We do not allow setting Winston options or transport options, since this is
// not very useful and can be achieved with level filtering.
export const applyOptions = (error, level, options = {}) => {
  const optionsA = typeof options === 'function' ? options(error) : options
  validateOptions(optionsA)
  const { level: levelA = level, stack = DEFAULT_STACK, transform } = optionsA
  const errorA =
    transform === undefined ? error : normalizeException(transform(error))
  return { level: levelA, stack, error: errorA }
}

// The default level must exist in all of `triple-beam.configs.*`
export const DEFAULT_LEVEL = 'error'
const DEFAULT_STACK = true

export const validateOptions = (options = {}) => {
  if (!isPlainObj(options)) {
    throw new TypeError(`It must be a plain object: ${options}`)
  }

  const { level, stack, transform, ...unknownOpts } = options
  validateLevel(level)
  validateStack(stack)
  validateTransform(transform)
  validateUnknownOpts(unknownOpts)
}

// The `level` option decides the log level for a specific error instance or
// class. It defaults to `error`.
const validateLevel = (level) => {
  if (level === undefined) {
    return
  }

  if (typeof level !== 'string') {
    throw new TypeError(`Option "level" must be a string: ${level}`)
  }

  if (!LEVELS.has(level)) {
    // eslint-disable-next-line fp/no-mutating-methods
    const availableLevels = [...LEVELS].sort().join(', ')
    throw new TypeError(
      `Option "level" must not be "${level}" but one of: ${availableLevels}`,
    )
  }
}

const getAvailableLevels = () =>
  new Set(
    Reflect.ownKeys(configs).flatMap((name) =>
      getAvailableLevel(configs[name]),
    ),
  )

const getAvailableLevel = ({ levels }) => Object.keys(levels)

const LEVELS = getAvailableLevels()

// The `stack` boolean option decides whether to log stack traces.
// It defaults to `true`.
const validateStack = (stack) => {
  if (stack !== undefined && typeof stack !== 'boolean') {
    throw new TypeError(`Option "stack" must be a boolean: ${stack}`)
  }
}

// The `transform` option allows transforming the error
// It defaults to `true`.
const validateTransform = (transform) => {
  if (transform !== undefined && typeof transform !== 'function') {
    throw new TypeError(`Option "transform" must be a function: ${transform}`)
  }
}

const validateUnknownOpts = (unknownOpts) => {
  const [unknownOpt] = Object.keys(unknownOpts)

  if (unknownOpt !== undefined) {
    throw new TypeError(`Option "${unknownOpt}" is unknown.`)
  }
}
