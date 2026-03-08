import Anthropic from '@anthropic-ai/sdk'
import { config } from '../config.mjs'

/**
 * Wrapper do Anthropic SDK para chat com mind clones.
 */
export class ClaudeClient {
  #client

  constructor(apiKey) {
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY nao configurado.')
    }
    this.#client = new Anthropic({ apiKey })
  }

  /**
   * Chat simples — retorna resposta completa.
   *
   * @param {string} systemPrompt
   * @param {Array<{role: string, content: string}>} messages
   * @param {object} options
   * @returns {Promise<{content: string, model: string, usage: object}>}
   */
  async chat(systemPrompt, messages, options = {}) {
    const model = options.model || config.defaultModel
    const max_tokens = options.max_tokens || config.defaultMaxTokens
    const temperature = options.temperature ?? config.defaultTemperature

    const response = await this.#client.messages.create({
      model,
      max_tokens,
      temperature,
      system: systemPrompt,
      messages: normalizeMessages(messages),
    })

    const content = response.content
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('')

    return {
      content,
      model: response.model,
      usage: {
        input_tokens: response.usage.input_tokens,
        output_tokens: response.usage.output_tokens,
      },
    }
  }

  /**
   * Chat com streaming via SSE.
   * Retorna um AsyncIterable que emite eventos de texto e stop.
   *
   * @param {string} systemPrompt
   * @param {Array<{role: string, content: string}>} messages
   * @param {object} options
   * @returns {AsyncIterable}
   */
  async *chatStream(systemPrompt, messages, options = {}) {
    const model = options.model || config.defaultModel
    const max_tokens = options.max_tokens || config.defaultMaxTokens
    const temperature = options.temperature ?? config.defaultTemperature

    const stream = this.#client.messages.stream({
      model,
      max_tokens,
      temperature,
      system: systemPrompt,
      messages: normalizeMessages(messages),
    })

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta') {
        yield { type: 'text_delta', text: event.delta.text }
      } else if (event.type === 'message_stop') {
        const finalMsg = await stream.finalMessage()
        yield {
          type: 'message_stop',
          usage: {
            input_tokens: finalMsg.usage.input_tokens,
            output_tokens: finalMsg.usage.output_tokens,
          },
        }
      }
    }
  }
}

/**
 * Garante que as mensagens estao no formato correto da API Anthropic.
 * Filtra papeis invalidos e garante alternancia user/assistant.
 */
function normalizeMessages(messages) {
  if (!Array.isArray(messages) || messages.length === 0) {
    return []
  }

  return messages
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .map((m) => ({ role: m.role, content: m.content }))
}
