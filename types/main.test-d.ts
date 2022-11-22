import templateName, { Options } from 'template-name'
import { expectType, expectAssignable } from 'tsd'

expectType<object>(templateName(true))

templateName(true, {})
expectAssignable<Options>({})
