import { Client } from '@notionhq/client'
import { getCommandArgs } from './shared.js'

const { NOTION_TOKEN } = process.env

if (NOTION_TOKEN == null || NOTION_TOKEN === '') {
  console.error('Missing NOTION_TOKEN environment variable')
  process.exit(1)
}

const notion = new Client({ auth: NOTION_TOKEN })

export const handleSearch = async ctx => {
  const args = getCommandArgs(ctx)
  const query = args.join(' ')

  try {
    const response = await notion.search({
      query,
      filter: {
        value: 'page',
        property: 'object',
      },
      sort: {
        direction: 'ascending',
        timestamp: 'last_edited_time',
      },
    })

    const mdLines = response.results
      .map(resultToMarkdown)
      .map(text => text.replaceAll('-', '\\-'))

    if (mdLines.length > 0) {
      ctx.replyWithMarkdownV2(`Opplà, ecco a te:
        • ${mdLines.join('\n• ')}
      `)
    } else {
      ctx.replyWithMarkdownV2(
        `Daniè, ma possibile che non se trova mai niente?\\!`,
      )
    }
  } catch (error) {
    ctx.reply(
      `Oh sti cazzo di computer non vanno manco a calci, mo' che vole notion? ${error.message}`,
    )
  }
}

const resultToMarkdown = ({ properties, url }) => {
  try {
    const title = properties?.title?.title?.find?.(item => item.type === 'text')
      ?.text?.content

    const destination = title ?? new URL(url).pathname.replace('/', '')

    return `[${destination}](${url})`
  } catch (error) {
    return url
  }
}
