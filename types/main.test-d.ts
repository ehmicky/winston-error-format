import {
  expectType,
  expectAssignable,
  expectNotAssignable,
  expectError,
} from 'tsd'
import { createLogger } from 'winston'
import { shortFormat, fullFormat, Format, Options } from 'winston-error-format'

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
expectError(fullFormat(true))
expectError(shortFormat(true))
expectNotAssignable<Options>(true)
expectError(fullFormat({ unknown: true }))
expectError(shortFormat({ unknown: true }))
expectNotAssignable<Options>({ unknown: true })

fullFormat({ level: 'error' })
shortFormat({ level: 'error' })
expectAssignable<Options>({ level: 'error' })
expectError(fullFormat({ level: true }))
expectError(shortFormat({ level: true }))
expectNotAssignable<Options>({ level: true })

fullFormat({ stack: true })
shortFormat({ stack: true })
expectAssignable<Options>({ stack: true })
expectError(fullFormat({ stack: 'true' }))
expectError(shortFormat({ stack: 'true' }))
expectNotAssignable<Options>({ stack: 'true' })

fullFormat({ transform: (error: Error) => error })
shortFormat({ transform: (error: Error) => error })
expectAssignable<Options>({ transform: (error: Error) => error })
fullFormat({ transform: () => new Error('test') })
shortFormat({ transform: () => new Error('test') })
expectAssignable<Options>({ transform: () => new Error('test') })
expectError(fullFormat({ transform: true }))
expectError(shortFormat({ transform: true }))
expectNotAssignable<Options>({ transform: true })
expectError(fullFormat({ transform: () => true }))
expectError(shortFormat({ transform: () => true }))
expectNotAssignable<Options>({ transform: () => true })
expectError(fullFormat({ transform: (error: Error, extra: true) => error }))
expectError(shortFormat({ transform: (error: Error, extra: true) => error }))
expectNotAssignable<Options>({
  transform: (error: Error, extra: true) => error,
})
expectError(fullFormat({ transform: (error: true) => error }))
expectError(shortFormat({ transform: (error: true) => error }))
expectNotAssignable<Options>({ transform: (error: true) => error })
