import { getMessage } from './shared.js'

const TTL_MS = 60 * 1000

const sessions = Object.create(null)

const touchSession = key => {
  const session = sessions[key] ?? {}

  clearTimeout(session.timeoutId)
  session.timeoutId = setTimeout(() => delete sessions[key], TTL_MS)

  sessions[key] = session
}

const keyFromCtx = ctx => {
  const { from, chat } = getMessage(ctx)
  const { id: senderId } = from
  const chatId = chat.type === 'private' ? 'private' : chat.id

  return `${chatId}:${senderId}`
}

export const setSessionData = (ctx, data) => {
  const key = keyFromCtx(ctx)
  touchSession(key)

  sessions[key].data = data
}

export const updateSessionData = (ctx, fn) => {
  const key = keyFromCtx(ctx)
  touchSession(key)

  return (sessions[key].data = fn(sessions[key].data ?? {}))
}

export const updateSessionDataAt = (ctx, key, fn) =>
  updateSessionData(ctx, sessionData => {
    sessionData[key] = fn(sessionData[key])

    return sessionData
  })

export const getSessionData = ctx => {
  const key = keyFromCtx(ctx)
  touchSession(key)

  return sessions[key].data
}

export const setSessionCommand = (ctx, cmd, handler) =>
  updateSessionDataAt(ctx, 'commands', (commands = {}) => {
    commands[cmd] = handler

    return commands
  })

export const getSessionCommands = ctx => getSessionData(ctx)?.commands
