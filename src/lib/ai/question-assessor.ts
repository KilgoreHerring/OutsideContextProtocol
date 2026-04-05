import { getClient } from './client'
import {
  questionAssessmentSystem,
  questionAssessmentUser,
} from './prompts'
import type { QuestionAssessmentResponse } from '@/types/grading'

function parseAIJson(text: string): unknown {
  let cleaned = text.trim()
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '')
  }
  if (!cleaned.startsWith('{') && !cleaned.startsWith('[')) {
    const match = cleaned.match(/\{[\s\S]*\}/)
    if (match) cleaned = match[0]
  }
  try {
    return JSON.parse(cleaned)
  } catch (e) {
    const fixedTrailingCommas = cleaned.replace(/,\s*([}\]])/g, '$1')
    try {
      return JSON.parse(fixedTrailingCommas)
    } catch {
      throw new Error(`Failed to parse AI response as JSON: ${cleaned.slice(0, 200)}...`)
    }
  }
}

export async function assessQuestion(
  question: string,
  exerciseContext: string,
  stepContext: string,
  relevanceGuidance: string,
  previousQuestions: string[]
): Promise<QuestionAssessmentResponse> {
  const client = getClient()

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 512,
    system: questionAssessmentSystem,
    messages: [
      {
        role: 'user',
        content: questionAssessmentUser(
          question,
          exerciseContext,
          stepContext,
          relevanceGuidance,
          previousQuestions
        ),
      },
    ],
  })

  const content = response.content[0]
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude')
  }

  return parseAIJson(content.text) as QuestionAssessmentResponse
}
