import { Markup } from 'telegraf'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

export const srcPath = dirname(fileURLToPath(import.meta.url))
export const appPath = join(srcPath, '..')
export const dataPath = join(appPath, 'data')

export const last = array => array[array.length - 1]

export const randItem = array => array[(Math.random() * array.length) | 0]

export const range = (start, end, step = 1) =>
  Array(1 + Math.floor((end - start) / step))
    .fill()
    .map((_, idx) => idx * step + start)

export const chunks = (array, size = 1) =>
  range(0, array.length - 1, size).map(start =>
    array.slice(start, start + size),
  )

export const capitalize = ([fst, ...rest]) =>
  fst.toLocaleUpperCase() + rest.join('')

export const textEllipsis = ([...chars], maxLength = 10, ellipsisChar = '…') =>
  chars.length > maxLength
    ? `${chars.slice(0, maxLength).join('')}${ellipsisChar}`
    : chars.join('')

export const tokenizeText = str => str.split(' ').filter(arg => arg !== '')

export const getMessage = ctx => ctx.update.message
export const getMessageSender = ctx => getMessage(ctx).from
export const getMessageText = ctx => getMessage(ctx).text
export const getSenderFirstName = ctx => getMessageSender(ctx).first_name
export const getCommandWithArgs = ctx => tokenizeText(getMessageText(ctx))
export const getCommandArgs = ctx => getCommandWithArgs(ctx).slice(1)
export const getCommand = ctx => getCommandWithArgs(ctx)[0]

export const deleteCallbackQueryMessage = ctx =>
  ctx.deleteMessage(ctx.callbackQuery.message.message_id)

export const button = ({ label, action }) =>
  Markup.button.callback(label, action)

export const buttonsKeyboard = ({ ctx, title, buttons, itemsPerLine = 3 }) =>
  ctx.replyWithMarkdown(
    title,
    Markup.inlineKeyboard(chunks(buttons.map(button), itemsPerLine)),
  )
