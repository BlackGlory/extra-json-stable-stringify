import { isObject, isntArray } from '@blackglory/prelude'

export function stringify(value: any): string {
  return JSON.stringify(value, (_, value) => {
    if (isObject(value) && isntArray(value)) {
      return Object.fromEntries(
        Object.entries(value).sort(([keyA], [keyB]) => {
          if (keyA === keyB) {
            return 0
          } else if (keyA > keyB) {
            return 1
          } else {
            return -1
          }
        })
      )
    } else {
      return value
    }
  })
}
