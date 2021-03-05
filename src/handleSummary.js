import { randItem, capitalize } from './shared.js'

const mates = [
  'assuran',
  'dreya',
  'yarbo',
  "jre'niel",
  'william',
  'bruenor',
  'bjorg',
]

const summaries = [
  () => 'Ma che significa che è rinato!?',
  () => 'Mi dispiace, i poteri forti non me lo permettono',
  () => 'Certamente, dammi il tempo di disconnettermi',
  () => 'Mi spiace, si è incendiato il server',
  () => 'Non s prndnd bn la ln, nn v snt piú',
  () => 'Il cane mi ha mangiato la linea',
  () => 'Ecco una 🇸 di Assuran',
  () => 'Faccio la cacca e torno',
  () => "Datemi solo l'avvio",
  () =>
    `Ma oggi è il turno di ${capitalize(
      randItem(mates.filter(m => m !== 'assuran')),
    )}`,
]

export const handleSummary = ctx => {
  const summary = randItem(summaries)()

  ctx.reply(summary)
}
