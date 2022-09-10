import { isObject, isntArray } from '@blackglory/prelude'
import { compareStringsAscending } from 'extra-sort'

export function stringify(value: any): string {
  return JSON.stringify(value, (_, value) => {
    if (isObject(value) && isntArray(value)) {
      return Object.fromEntries(
        Object
          .entries(value)
          .sort(([keyA], [keyB]) => compareStringsAscending(keyA, keyB))
      )
    } else {
      return value
    }
  })
}
