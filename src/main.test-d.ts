import { expectType, expectAssignable, expectNotAssignable } from 'tsd'
import { createLogger } from 'winston'
import {
  shortFormat,
  fullFormat,
  type Format,
  type Options,
} from 'winston-error-format'

const fFormat = fullFormat()
const sFormat = shortFormat()

expectType<Format>(fFormat)
expectType<Format>(sFormat)

createLogger({ format: fFormat })
createLogger({ format: sFormat })

fullFormat(undefined)
shortFormat(undefined)
fullFormat({})
shortFormat({})
expectAssignable<Options>({})
// @ts-expect-error
fullFormat(true)
// @ts-expect-error
shortFormat(true)
expectNotAssignable<Options>(true)
// @ts-expect-error
fullFormat({ unknown: true })
// @ts-expect-error
shortFormat({ unknown: true })
expectNotAssignable<Options>({ unknown: true })

fullFormat({ level: 'error' })
shortFormat({ level: 'error' })
expectAssignable<Options>({ level: 'error' })
// @ts-expect-error
fullFormat({ level: true })
// @ts-expect-error
shortFormat({ level: true })
expectNotAssignable<Options>({ level: true })

fullFormat({ stack: true })
shortFormat({ stack: true })
expectAssignable<Options>({ stack: true })
// @ts-expect-error
fullFormat({ stack: 'true' })
// @ts-expect-error
shortFormat({ stack: 'true' })
expectNotAssignable<Options>({ stack: 'true' })

fullFormat({ transform: (error: Error) => error })
shortFormat({ transform: (error: Error) => error })
expectAssignable<Options>({ transform: (error: Error) => error })
fullFormat({ transform: () => new Error('test') })
shortFormat({ transform: () => new Error('test') })
expectAssignable<Options>({ transform: () => new Error('test') })
// @ts-expect-error
fullFormat({ transform: true })
// @ts-expect-error
shortFormat({ transform: true })
expectNotAssignable<Options>({ transform: true })
// @ts-expect-error
fullFormat({ transform: () => true })
// @ts-expect-error
shortFormat({ transform: () => true })
expectNotAssignable<Options>({ transform: () => true })
// @ts-expect-error
fullFormat({ transform: (error: Error, extra: true) => error })
// @ts-expect-error
shortFormat({ transform: (error: Error, extra: true) => error })
expectNotAssignable<Options>({
  transform: (error: Error, extra: true) => error,
})
// @ts-expect-error
fullFormat({ transform: (error: true) => error })
// @ts-expect-error
shortFormat({ transform: (error: true) => error })
expectNotAssignable<Options>({ transform: (error: true) => error })

fullFormat(() => ({}))
shortFormat(() => ({}))
expectNotAssignable<Options>(() => ({}))
fullFormat(() => ({ stack: true }))
shortFormat(() => ({ stack: true }))
// @ts-expect-error
fullFormat(() => ({ stack: 'true' }))
// @ts-expect-error
shortFormat(() => ({ stack: 'true' }))
