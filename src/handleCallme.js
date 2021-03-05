import { getUser, updateUser } from './user.js'
import { getCommand, getMessage } from './shared.js'

export const handleCallme = ctx => {
  const command = getCommand(ctx)
  const { from: sender, text } = getMessage(ctx)
  const user = getUser(sender.id) ?? sender
  const nick = text.replace(command, '').trim()

  if (nick.length > 0) {
    user.nick = nick
    updateUser(user)

    ctx.reply(`Tranquillo ${nick}, c'ho tutto sotto controllo`)
  } else {
    ctx.reply(`Com'è che ti devo chiamà??`)
  }
}
