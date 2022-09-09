import { stringify } from '@src/stringify'
import path from 'path'
import fastJSONStableStringify from 'fast-json-stable-stringify'
import { readJSONFileSync } from 'extra-filesystem'

describe('stringify', () => {
  test('stability', () => {
    const value = {
      b: 'foo'
    , a: 'bar'
    }

    const result = stringify(value)

    expect(result).toStrictEqual(JSON.stringify({
      a: 'bar'
    , b: 'foo'
    }))
  })

  test('accuracy', () => {
    const value = readJSONFileSync(path.join(__dirname, 'sample.json'))

    const result = stringify(value)
    
    expect(result).toStrictEqual(fastJSONStableStringify(value))
  })
})
