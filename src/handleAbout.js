import leven from 'leven'
import { v4 as uuidv4 } from 'uuid'

import { getCommand, getMessage, capitalize } from './shared.js'
import { readStack, pushStackItem } from './storage.js'
import { getUser } from './user.js'

const aboutData = Object.create(null)

const addItem = item => {
  const valueArray = aboutData[item.normalizedKey] ?? []
  valueArray.push(item)

  return (aboutData[item.normalizedKey] = valueArray)
}

let aboutQueue = readStack('about').then(array => array.forEach(addItem))

const normalizeKey = keyword =>
  keyword
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleUpperCase()

export const handleStoreAbout = ctx => {
  const command = getCommand(ctx)
  const { text: fullMessage, from: author } = getMessage(ctx)
  const text = fullMessage.replace(command, '').trim()
  const [textBeforeColon] = text.split(':', 1)
  const keyword = textBeforeColon.trim()
  const content = text.substring(textBeforeColon.length + 1).trim()

  if (content.length === 0) {
    return ctx.reply('Maschio, mi manca na descrizione')
  }

  aboutQueue = aboutQueue.then(() => {
    const item = {
      id: uuidv4(),
      user_id: author.id,
      normalizedKey: normalizeKey(keyword),
      keyword,
      content,
    }

    if (addItem(item).length === 1) {
      ctx.reply(`Daje, ce l'ho!`)
    } else {
      ctx.reply(`Okay, l'aggiungo a quell'altra`)
    }

    return pushStackItem('about', item)
  })
}

const authorReplyFromId = authorId => {
  const author = getUser(authorId)
  const authorName = author?.nick ?? author?.first_name

  return authorName
    ? `Me l'ha detto _${authorName}_`
    : `Non me ricordo chi me l'ha detto`
}

const singleItemReply = ({ user_id: authorId, keyword, content }) =>
  `Tiè *${keyword}* la so: ${content}\n\n${authorReplyFromId(authorId)}`

const itemReply = ({ user_id: authorId, content }) =>
  `${capitalize(content)}\n  ${authorReplyFromId(authorId)}`

const replyFromItemArray = items => {
  if (items.length === 1) {
    return singleItemReply(items[0])
  }

  const [{ keyword }] = items
  const replyHeader = `Allora, c'ho un po' di appunti su *${keyword}*:`

  return `${replyHeader}\n\n${items.map(itemReply).join('\n\n')}`
}

const replyFromKeyword = keyword => {
  const key = normalizeKey(keyword)
  const items = aboutData[key]

  if (items != null) {
    return replyFromItemArray(items)
  }

  if (keyword.length > 2 && keyword.length < 20) {
    const isCloseMatch = knownKey =>
      knownKey.includes(key) ||
      key.includes(knownKey) ||
      leven(knownKey, key) < 4

    const closeMatches = Object.keys(aboutData).filter(isCloseMatch)

    if (closeMatches.length === 1) {
      return replyFromItemArray(aboutData[closeMatches[0]])
    }

    if (closeMatches.length > 1) {
      const retrievedKeyword = closeMatches.map(
        key => aboutData[key][0].keyword,
      )
      const formattedKeywords = retrievedKeyword.join('* o *')

      return `Mmh non lo so, famo che cerchi *${formattedKeywords}* invece?`
    }
  }

  return 'Non lo so, mi arrendo'
}

export const handleRetrieveAbout = ctx => {
  const command = getCommand(ctx)
  const { text } = getMessage(ctx)
  const keyword = text.replace(command, '').trim()

  if (keyword.length === 0) {
    return ctx.reply('Maschio, mi devi dì che cosa devo cercà')
  }

  aboutQueue.then(() => ctx.replyWithMarkdown(replyFromKeyword(keyword)))
}
