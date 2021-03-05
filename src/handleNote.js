import { v4 as uuidv4 } from 'uuid'

import { readStack, writeStack, pushStackItem } from './storage.js'
import { setSessionCommand } from './session.js'
import {
  last,
  getMessage,
  getCommandWithArgs,
  deleteCallbackQueryMessage,
  buttonsKeyboard,
  textEllipsis,
} from './shared.js'

const notes = []

readStack('notes').then(array => array.forEach(note => notes.push(note)))

const emptyNotesMsg = 'Eeh non trovo gli appunti'

const getAllNotesReply = () =>
  notes.length > 0
    ? notes.map(rem => `• ${rem.content}`).join('\n\n')
    : emptyNotesMsg

const getLatestNoteContent = () => last(notes)?.content ?? emptyNotesMsg

const getLatestNoteReply = () =>
  notes.length > 0
    ? `Volevi l'ultima nota? Tiè: ${getLatestNoteContent()}`
    : emptyNotesMsg

const selectNoteToDelete = ctx =>
  buttonsKeyboard({
    ctx,
    title: 'Quale cancello?',
    buttons: notes.map(note => ({
      label: textEllipsis(note.content),
      action: `delete:note ${note.id}`,
    })),
  })

export const handleAllNotes = ctx => {
  setSessionCommand(ctx, '/delete', selectNoteToDelete)

  ctx.reply(getAllNotesReply())
}

export const handleLatestNote = ctx => {
  ctx.reply(getLatestNoteContent())
}

export const handleNote = ctx => {
  const [command, ...args] = getCommandWithArgs(ctx)
  const { date, from, text } = getMessage(ctx)
  const content = text.replace(command, '').trim()

  if (args.length === 1) {
    switch (args[0]) {
      case 'show':
        return handleAllNotes(ctx)
      case 'latest':
        return handleLatestNote(ctx)
    }
  }

  if (content.length > 0) {
    const note = { id: uuidv4(), user_id: from.id, date, content }

    notes.push(note)
    pushStackItem('notes', note)

    return ctx.reply('Daje, questa me la scrivo')
  }

  ctx.reply(getLatestNoteReply())
}

export const handleDeleteNote = (ctx, id) => {
  deleteCallbackQueryMessage(ctx)

  const noteIndex = notes.findIndex(note => note.id === id)

  if (noteIndex < 0) {
    return
  }

  notes.splice(noteIndex, 1)
  writeStack('notes', notes)
}
