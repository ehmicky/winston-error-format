import winstonErrorFormat, { Options } from 'winston-error-format'
import { expectType, expectAssignable } from 'tsd'

expectType<object>(winstonErrorFormat(true))

winstonErrorFormat(true, {})
expectAssignable<Options>({})
