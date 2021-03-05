import { Telegraf } from 'telegraf'
import leven from 'leven'

import { getCommand, tokenizeText } from './shared.js'
import { registerUser } from './user.js'
import { getSessionCommands } from './session.js'
import { handleWave } from './handleWave.js'
import { handleSummary } from './handleSummary.js'
import { handleRoll } from './handleRoll.js'
import { handleNote, handleAllNotes, handleDeleteNote } from './handleNote.js'
import { handleCallme } from './handleCallme.js'
import { handleRetrieveAbout, handleStoreAbout } from './handleAbout.js'

const { BOT_TOKEN } = process.env

if (!BOT_TOKEN) {
  console.error('Missing BOT_TOKEN, try BOT_TOKEN="<your token>" node index.js')
  process.exit(1)
}

const bot = new Telegraf(BOT_TOKEN)

const getHelp = () =>
  `Allora, che te dico, puoi fa tipo /roll 10, ma pure /r andava bene alla fine

Ah poi tutti st'altri

${Object.keys(commands).join('\n')}
`

const handleHelp = ctx => ctx.reply(getHelp())

const commands = {
  '/help': handleHelp,
  '/wave': handleWave,
  '/summary': handleSummary,
  '/riassunto': handleSummary,
  '/r': handleRoll,
  '/roll': handleRoll,
  '/nota': handleNote,
  '/note': handleNote,
  '/notes': handleAllNotes,
  '/callme': handleCallme,
  '/about': handleRetrieveAbout,
  '/ricorda': handleStoreAbout,
  '/remember': handleStoreAbout,
}

bot.on('text', ctx => {
  const token = getCommand(ctx)

  registerUser(ctx)

  if (!token.startsWith('/')) {
    return
  }

  const handler = getSessionCommands(ctx)?.[token] ?? commands[token]

  if (handler != null) {
    handler(ctx)

    return
  }

  if (token.length > 20) {
    ctx.reply(`Aho biondo, stai calmo`)

    return
  }

  const isCloseMatch = knownCommand => leven(knownCommand, token) < 3
  const closeMatches = Object.keys(commands).filter(isCloseMatch)

  if (token.length > 2 && closeMatches.length > 0) {
    ctx.reply(`Aspè, questa la so! Volevi dì tipo ${closeMatches.join(' o ')}?`)

    return
  }

  ctx.reply(`Cazzo, mi sa che m'è sfuggito qualcosa! Aiuto Pandi`)
})

const actions = {
  'delete:note': handleDeleteNote,
}

bot.on('callback_query', ctx => {
  const [token, ...args] = tokenizeText(ctx.callbackQuery.data)

  actions[token]?.(ctx, ...args)
})

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
