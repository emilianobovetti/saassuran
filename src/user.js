import { readJson, storeJson } from './storage.js'
import { getMessageSender } from './shared.js'

const knownUsers = Object.create(null)

let userQueue = readJson('users').then(users => {
  for (let [id, user] of Object.entries(users ?? {})) {
    knownUsers[id] = user
  }
})

export const getUser = userId => knownUsers[userId]

export const getSenderNickOrFirstName = ctx => {
  const sender = getMessageSender(ctx)

  return getUser(sender.id)?.nick ?? sender.first_name
}

export const updateUser = user => {
  knownUsers[user.id] = user

  userQueue = userQueue.then(() => storeJson('users', knownUsers))
}

export const registerUser = ctx => {
  const sender = getMessageSender(ctx)

  userQueue.then(() => knownUsers[sender.id] == null && updateUser(sender))
}
