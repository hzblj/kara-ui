import {llmsIndex} from '../../src/docs/llms'

export const dynamic = 'force-static'

export const GET = () => new Response(llmsIndex(), {headers: {'Content-Type': 'text/plain; charset=utf-8'}})
