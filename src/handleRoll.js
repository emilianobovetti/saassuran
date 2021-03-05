import { getSenderNickOrFirstName } from './user.js'
import { randItem, getCommandArgs, capitalize } from './shared.js'

const roll = (dice = 20) => ((Math.random() * dice) | 0) + 1

const swearing = ['cazzo', 'merda', 'nooo']

const ninetyPercentComments = [
  res => `Mastro della percezione, ${res}`,
  res =>
    `Dai, dai, co ${res} ho visto tutto, ho visto pure la mosca che stava a passà co ${res}`,
]

const rollComments = {
  critFail: res => `${capitalize(randItem(swearing))} ${res}!`,
  critSucc: () => 'LA SITUAZIOOOONEEEEE',
  0: res => `Che merda, ${res}`,
  1: res => `Sto a soffrì dentro co ${res}`,
  2: res =>
    `No vabbè io me rifiuto di giocà così, me rifiuto di giocà co ${res}`,
  3: res => `È uscito ${res}, è na situazione`,
  4: res => `Boh è scito ${res}`,
  5: res =>
    `Cazzo di server di merda fa uscì tutti risultati del cazzo. Che cazzo di tiro è ${res}`,
  6: res => `Mh. Poteva annà mejo, poteva annà peggio. Ho fatto ${res}`,
  7: res => `Dai, onesto, ${res} è onesto Pandi`,
  8: res => `Vabbè dai meglio di un calcio al culo, ${res}`,
  9: res => randItem(ninetyPercentComments)(res),
}

const isValidDice = num => Number.isSafeInteger(num) && num > 1

const getRollReply = dice => {
  const res = roll(dice)
  const percent = res / dice

  return res === 1
    ? rollComments.critFail(res)
    : res === dice
    ? rollComments.critSucc(res)
    : rollComments[(percent * 10) | 0](res)
}

export const handleRoll = ctx => {
  const [fstArg = 20] = getCommandArgs(ctx)
  const dice = +fstArg

  if (isValidDice(dice)) {
    ctx.reply(getRollReply(dice))
  } else {
    const userName = getSenderNickOrFirstName(ctx)

    ctx.reply(`${userName} me pari matto, che cazzo di dado è ${fstArg}??`)
  }
}
