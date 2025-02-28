import { Benchmark } from 'extra-benchmark'
import { go } from '@blackglory/prelude'
import { readJSONFileSync } from 'extra-filesystem'
import path from 'path'
import fastJSONStableStringify from 'fast-json-stable-stringify'
import fastStableStringify from 'fast-stable-stringify'
import { isObject, isntArray } from '@blackglory/prelude'
import { compareStringsAscending } from 'extra-sort'
import '@src/fast-stable-stringify-types'

const sample = readJSONFileSync(path.join(__dirname, 'sample.json'))

const benchmark = new Benchmark('JSON stringify', {
  warmUps: 10000
, runs: 10000
})

benchmark.addCase('JSON.stringify', () => {
  return () => {
    JSON.stringify(sample)
  }
})

benchmark.addCase('fast-json-stable-stringify', () => {
  return () => {
    fastJSONStableStringify(sample)
  }
})

benchmark.addCase('fast-stable-stringify', () => {
  return () => {
    fastStableStringify(sample)
  }
})

benchmark.addCase('simple implementation', () => {
  return () => {
    stringify(sample)
  }

  function stringify(value: any): string {
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
})

go(async () => {
  for await (const result of benchmark.run()) {
    console.log(result)
  }
})
