import { existsSync, mkdirSync } from 'fs'
import { readFile, writeFile, appendFile } from 'fs/promises'
import { join } from 'path'

import { dataPath } from './shared.js'

if (!existsSync(dataPath)) {
  mkdirSync(dataPath)
}

const storeQueue = Object.create(null)

const enqueue = (filePath, job) => {
  const currentJob = storeQueue[filePath] ?? Promise.resolve()

  return (storeQueue[filePath] = currentJob.then(job))
}

export const readJson = key => {
  const filePath = join(dataPath, key)

  return enqueue(filePath, () =>
    readFile(filePath).then(
      buf => JSON.parse(buf.toString()),
      err => (err.code === 'ENOENT' ? null : Promise.reject(err)),
    ),
  )
}

export const storeJson = (key, data) => {
  const filePath = join(dataPath, key)
  const rawString = JSON.stringify(data, null, 2)

  return enqueue(filePath, () => writeFile(filePath, rawString))
}

const sep = '"""'

const serializeStackItem = data =>
  `${sep}${JSON.stringify(data).replaceAll(sep, '')}\n`

export const readStack = key => {
  const filePath = join(dataPath, key)

  return enqueue(filePath, () =>
    readFile(filePath).then(
      buf => buf.slice(sep.length).toString().split(sep).map(JSON.parse),
      err => (err.code === 'ENOENT' ? [] : Promise.reject(err)),
    ),
  )
}

export const writeStack = (key, array) => {
  const filePath = join(dataPath, key)
  const rawString = array.map(serializeStackItem).join('')

  return enqueue(filePath, () => writeFile(filePath, rawString))
}

export const pushStackItem = (key, data) => {
  const filePath = join(dataPath, key)
  const rawString = serializeStackItem(data)

  return enqueue(filePath, () => appendFile(filePath, rawString))
}
