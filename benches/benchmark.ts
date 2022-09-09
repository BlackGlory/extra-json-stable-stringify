import { Benchmark } from 'extra-benchmark'
import { go } from '@blackglory/prelude'
import { readJSONFileSync } from 'extra-filesystem'
import path from 'path'
import fastJSONStableStringify from 'fast-json-stable-stringify'
import fastStableStringify from 'fast-stable-stringify'
import { stringify } from '..'

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

benchmark.addCase('ultra-json-stable-stringify', () => {
  return () => {
    stringify(sample)
  }
})

go(async () => {
  for await (const result of benchmark.run()) {
    console.log(result)
  }
})
