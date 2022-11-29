import type { Format } from 'logform'

/**
 * Winston format.
 */
export type { Format }

/**
 * Options of `winston-error-format`
 */
export interface Options {
  /**
   * Whether to log the stack trace.
   *
   * @default `true`
   */
  readonly stack?: boolean

  /**
   * Override the log
   * [level](https://github.com/winstonjs/winston#logging-levels).
   */
  readonly level?: string

  /**
   * Maps the `error` before logging it.
   */
  readonly transform?: (error: Error) => Error
}

/**
 *
 */
type DynamicOptions = Options | ((error: Error) => Options)

/**
 * Returns a logger
 * [`format`](https://github.com/winstonjs/winston/blob/master/README.md#formats)
 * to [combine](https://github.com/winstonjs/winston#combining-formats) with
 * [`format.simple()`](https://github.com/winstonjs/logform#simple) or
 * [`format.cli()`](https://github.com/winstonjs/logform#cli). This logs only
 * the error `name`, `message` and `stack`, making it useful with
 * [transports](https://github.com/winstonjs/winston#transports) like the
 * [console](https://github.com/winstonjs/winston/blob/master/docs/transports.md#console-transport).
 *
 * Errors should be logged using
 * [`logger.*(error)`](https://github.com/winstonjs/winston/blob/master/README.md#creating-your-own-logger).
 *
 * @example
 * ```js
 * import { createLogger, transports, format } from 'winston'
 *
 * const logger = createLogger({
 *   format: format.combine(shortFormat(), format.cli()),
 *   transports: [new transports.Console()],
 * })
 *
 * const error = new ExampleError('Could not read file.')
 * logger.error(error)
 * // Printed on the console:
 * // error: ExampleError: Could not read file.
 * //     at ...
 * ```
 */
export function shortFormat(options?: DynamicOptions): Format

/**
 * Returns a logger
 * [`format`](https://github.com/winstonjs/winston/blob/master/README.md#formats)
 * to [combine](https://github.com/winstonjs/winston#combining-formats) with
 * [`format.json()`](https://github.com/winstonjs/logform#json) or
 * [`format.prettyPrint()`](https://github.com/winstonjs/logform#prettyprint).
 * This logs all error properties, making it useful with
 * [transports](https://github.com/winstonjs/winston#transports) like
 * [HTTP](https://github.com/winstonjs/winston/blob/master/docs/transports.md#http-transport).
 *
 * Errors should be logged using
 * [`logger.*(error)`](https://github.com/winstonjs/winston/blob/master/README.md#creating-your-own-logger).
 *
 * @example
 * ```js
 * import { createLogger, transports, format } from 'winston'
 *
 * const logger = createLogger({
 *   format: format.combine(fullFormat(), format.json()),
 *   transports: [new transports.Http(httpOptions)],
 * })
 *
 * const error = new ExampleError('Could not read file.')
 * error.filePath = '/...'
 * logger.error(error)
 * // Sent via HTTP:
 * // {
 * //   level: 'error',
 * //   name: 'ExampleError',
 * //   message: 'Could not read file.',
 * //   stack: `ExampleError: Could not read file.
 * //     at ...`,
 * //   filePath: '/...',
 * // }
 * ```
 */
export function fullFormat(options?: DynamicOptions): Format
