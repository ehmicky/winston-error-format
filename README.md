[![Node](https://img.shields.io/badge/-Node.js-808080?logo=node.js&colorA=404040&logoColor=66cc33)](https://www.npmjs.com/package/winston-error-format)
[![TypeScript](https://img.shields.io/badge/-Typed-808080?logo=typescript&colorA=404040&logoColor=0096ff)](/types/main.d.ts)
[![Codecov](https://img.shields.io/badge/-Tested%20100%25-808080?logo=codecov&colorA=404040)](https://codecov.io/gh/ehmicky/winston-error-format)
[![Minified size](https://img.shields.io/bundlephobia/minzip/winston-error-format?label&colorA=404040&colorB=808080&logo=webpack)](https://bundlephobia.com/package/winston-error-format)
[![Mastodon](https://img.shields.io/badge/-Mastodon-808080.svg?logo=mastodon&colorA=404040&logoColor=9590F9)](https://fosstodon.org/@ehmicky)
[![Medium](https://img.shields.io/badge/-Medium-808080.svg?logo=medium&colorA=404040)](https://medium.com/@ehmicky)

Log errors with [Winston](https://github.com/winstonjs/winston).

This provides with two
[Winston formats](https://github.com/winstonjs/winston/blob/master/README.md#formats)
to log errors with Winston.

# Features

- The [full format](#fullformatoptions) includes all properties
- The [short format](#shortformatoptions) includes only the error's name,
  message and stack
- Includes the [stack trace](#stack) or not
- Prevents Winston from modifying the error instance
- Works with
  [uncaught exceptions](https://github.com/winstonjs/winston#exceptions)

# Example

Using the [full format](#fullformatoptions) with Winston.

```js
import { createLogger, transports, format } from 'winston'
import { fullFormat } from 'winston-error-format'

const logger = createLogger({
  format: format.combine(fullFormat(), format.json()),
  transports: [new transports.Http(httpOptions)],
})

const error = new ExampleError('Could not read file.')
error.filePath = '/...'
logger.error(error)
// Sent via HTTP:
// {
//   level: 'error',
//   name: 'ExampleError',
//   message: 'Could not read file.',
//   stack: `ExampleError: Could not read file.
//     at ...`,
//   filePath: '/...',
// }
```

Using the [short format](#shortformatoptions) with Winston.

```js
import { createLogger, transports, format } from 'winston'
import { shortFormat } from 'winston-error-format'

const logger = createLogger({
  format: format.combine(shortFormat(), format.cli()),
  transports: [new transports.Console()],
})

const error = new ExampleError('Could not read file.')
logger.error(error)
// Printed on the console:
// error: ExampleError: Could not read file.
//     at ...
```

# Install

```bash
npm install winston-error-format
```

This package requires installing [Winston](https://github.com/winstonjs/winston)
separately.

```bash
npm install winston
```

This package works in Node.js >=14.18.0. It is an ES module and must be loaded
using
[an `import` or `import()` statement](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c),
not `require()`.

# API

## fullFormat(options?)

`options`: [`Options`](#options)\
_Return value_: `Format`

Returns a logger
[`format`](https://github.com/winstonjs/winston/blob/master/README.md#formats)
to [combine](https://github.com/winstonjs/winston#combining-formats) with
[`format.json()`](https://github.com/winstonjs/logform#json) or
[`format.prettyPrint()`](https://github.com/winstonjs/logform#prettyprint). This
logs all error properties, making it useful with
[transports](https://github.com/winstonjs/winston#transports) like
[HTTP](https://github.com/winstonjs/winston/blob/master/docs/transports.md#http-transport).

Errors should be logged using
[`logger.*(error)`](https://github.com/winstonjs/winston/blob/master/README.md#creating-your-own-logger).

## shortFormat(options?)

`options`: [`Options`](#options)\
_Return value_: `Format`

Returns a logger
[`format`](https://github.com/winstonjs/winston/blob/master/README.md#formats)
to [combine](https://github.com/winstonjs/winston#combining-formats) with
[`format.simple()`](https://github.com/winstonjs/logform#simple) or
[`format.cli()`](https://github.com/winstonjs/logform#cli). This logs only the
error name, message and stack, making it useful with
[transports](https://github.com/winstonjs/winston#transports) like the
[console](https://github.com/winstonjs/winston/blob/master/docs/transports.md#console-transport).

Errors should be logged using
[`logger.*(error)`](https://github.com/winstonjs/winston/blob/master/README.md#creating-your-own-logger).

## Options

_Type_: `object | ((Error) => object)`

Options are an object. They can be error-specific by using a function returning
an object instead.

### stack

_Type_: `boolean`\
_Default_: `true`

Whether to log the stack trace.

### level

_Type_: `string`

Override the log [level](https://github.com/winstonjs/winston#logging-levels).

### transform

_Type_: `(Error) => Error`

Maps the `error` before logging it.

# Related projects

- [`modern-errors`](https://github.com/ehmicky/modern-errors): Handle errors
  like it's 2023 🔮
- [`modern-errors-serialize`](https://github.com/ehmicky/modern-errors-serialize):
  Serialize/parse errors
- [`error-custom-class`](https://github.com/ehmicky/error-custom-class): Create
  one error class
- [`error-class-utils`](https://github.com/ehmicky/error-class-utils): Utilities
  to properly create error classes
- [`error-serializer`](https://github.com/ehmicky/error-serializer): Convert
  errors to/from plain objects
- [`normalize-exception`](https://github.com/ehmicky/normalize-exception):
  Normalize exceptions/errors
- [`is-error-instance`](https://github.com/ehmicky/is-error-instance): Check if
  a value is an `Error` instance
- [`merge-error-cause`](https://github.com/ehmicky/merge-error-cause): Merge an
  error with its `cause`
- [`set-error-class`](https://github.com/ehmicky/set-error-class): Properly
  update an error's class
- [`set-error-message`](https://github.com/ehmicky/set-error-message): Properly
  update an error's message
- [`wrap-error-message`](https://github.com/ehmicky/wrap-error-message):
  Properly wrap an error's message
- [`set-error-props`](https://github.com/ehmicky/set-error-props): Properly
  update an error's properties
- [`set-error-stack`](https://github.com/ehmicky/set-error-stack): Properly
  update an error's stack
- [`error-cause-polyfill`](https://github.com/ehmicky/error-cause-polyfill):
  Polyfill `error.cause`
- [`handle-cli-error`](https://github.com/ehmicky/handle-cli-error): 💣 Error
  handler for CLI applications 💥
- [`safe-json-value`](https://github.com/ehmicky/safe-json-value): ⛑️ JSON
  serialization should never fail
- [`log-process-errors`](https://github.com/ehmicky/log-process-errors): Show
  some ❤ to Node.js process errors
- [`error-http-response`](https://github.com/ehmicky/error-http-response):
  Create HTTP error responses

# Support

For any question, _don't hesitate_ to [submit an issue on GitHub](../../issues).

Everyone is welcome regardless of personal background. We enforce a
[Code of conduct](CODE_OF_CONDUCT.md) in order to promote a positive and
inclusive environment.

# Contributing

This project was made with ❤️. The simplest way to give back is by starring and
sharing it online.

If the documentation is unclear or has a typo, please click on the page's `Edit`
button (pencil icon) and suggest a correction.

If you would like to help us fix a bug or add a new feature, please check our
[guidelines](CONTRIBUTING.md). Pull requests are welcome!

<!-- Thanks go to our wonderful contributors: -->

<!-- ALL-CONTRIBUTORS-LIST:START -->
<!-- prettier-ignore -->
<!--
<table><tr><td align="center"><a href="https://fosstodon.org/@ehmicky"><img src="https://avatars2.githubusercontent.com/u/8136211?v=4" width="100px;" alt="ehmicky"/><br /><sub><b>ehmicky</b></sub></a><br /><a href="https://github.com/ehmicky/winston-error-format/commits?author=ehmicky" title="Code">💻</a> <a href="#design-ehmicky" title="Design">🎨</a> <a href="#ideas-ehmicky" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/ehmicky/winston-error-format/commits?author=ehmicky" title="Documentation">📖</a></td></tr></table>
 -->
<!-- ALL-CONTRIBUTORS-LIST:END -->
