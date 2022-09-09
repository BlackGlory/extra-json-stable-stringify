import { isObject, isArray } from '@blackglory/prelude'

export function stringify(value: any): string {
  if (isObject(value)) {
    if (isArray(value)) {
      let result = ''
      const maxIndex = value.length - 1
      // eslint-disable-next-line
      for (var i = 0; i < maxIndex; i++) {
        const element = value[i]
        // JSON序列化时会将undefined元素视作null
        result += (
          element === undefined
          ? 'null'
          : stringify(element)
        ) + ','
      }
      if (maxIndex !== -1) {
        const element = value[i]
        // JSON序列化时会将undefined元素视作null
        result += element === undefined
                  ? 'null'
                  : stringify(element)
      }

      return '[' + result + ']'
    } else {
      let result = ''
      for (const key of Object.keys(value).sort()) {
        // JSON序列化时会忽略为undefined的property
        if (value[key] !== undefined) {
          const propertyValue = stringify(value[key])
          if (result) {
            result += ','
          }

          result += JSON.stringify(key) + ':' + propertyValue
        }
      }

      return '{' + result + '}'
    }
  }

  return JSON.stringify(value)
}
