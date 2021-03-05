import { randItem } from './shared.js'
import { getSenderNickOrFirstName } from './user.js'

const waves = [
  name => `Daje ${name} grandeee`,
  name => `Salve coraggioso ${name}, posso offrirti una birra?`,
  name => `Punto ispirazione a ${name}`,
  name => `Salve mastro ${name}`,
  name => `A ${name} ma na curetta al volo?`,
]

export const handleWave = ctx => {
  const userName = getSenderNickOrFirstName(ctx)
  const wave = randItem(waves)(userName)

  ctx.reply(wave)
}
