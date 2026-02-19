import { getClient } from './client'
import { chatResponderSystem, chatResponderUser } from './prompts'
import type { ExerciseStep, GradingRubric } from '@/types/exercise'
import type { ChatMessage } from '@/types/session'

export async function getChatResponse(
  rubric: GradingRubric,
  currentStep: ExerciseStep,
  history: ChatMessage[],
  newMessage: string
): Promise<string> {
  const client = getClient()

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20250929',
    max_tokens: 1024,
    system: chatResponderSystem(rubric, currentStep),
    messages: [
      {
        role: 'user',
        content: chatResponderUser(history, newMessage),
      },
    ],
  })

  const content = response.content[0]
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude')
  }

  return content.text
}
