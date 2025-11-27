const formatter = new Intl.DateTimeFormat('en', {
  localeMatcher: 'lookup',
  calendar: 'iso8601',
  numberingSystem: 'latn',
  timeZone: 'Europe/Rome',
  day: '2-digit',
  month: '2-digit',
})

const wishes = {
  '27/11': 'Mortacci al pandinoooo',
}

export const handleBirthday = ctx => {
  const date = formatBirthdayDate(new Date())

  ctx.reply(wishes[date] ?? `Che me so' perso qualcosa??`)
}

const formatBirthdayDate = date => {
  const parts = formatter.formatToParts(date)
  const form = Object.fromEntries(parts.map(part => [part.type, part.value]))

  return `${form.day}/${form.month}`
}
