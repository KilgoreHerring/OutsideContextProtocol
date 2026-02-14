import { getClient } from './client'
import {
  exerciseGenerationSystem,
  exerciseGenerationUser,
} from './prompts'
import type { UploadedDocument } from '@/types/document'
import type { ExerciseStep, GradingRubric } from '@/types/exercise'

interface GenerationResult {
  steps: ExerciseStep[]
  rubric: Omit<GradingRubric, 'exerciseId'>
  narrative: string
}

function parseAIJson(text: string): unknown {
  let cleaned = text.trim()
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '')
  }
  if (!cleaned.startsWith('{')) {
    const match = cleaned.match(/\{[\s\S]*\}/)
    if (match) cleaned = match[0]
  }
  return JSON.parse(cleaned)
}

export async function generateExercise(
  title: string,
  matterType: string,
  estimatedMinutes: number,
  documents: UploadedDocument[]
): Promise<GenerationResult> {
  const client = getClient()

  const response = await client.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 16384,
    system: exerciseGenerationSystem(estimatedMinutes),
    messages: [
      {
        role: 'user',
        content: exerciseGenerationUser(title, matterType, documents),
      },
    ],
  })

  if (response.stop_reason === 'max_tokens') {
    throw new Error('Exercise generation exceeded token limit — the AI response was cut off. Try reducing the number or size of uploaded documents.')
  }

  const content = response.content[0]
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude')
  }

  try {
    const parsed = parseAIJson(content.text) as GenerationResult
    return parsed
  } catch (e) {
    throw new Error(`Failed to parse generated exercise: ${e instanceof Error ? e.message : 'invalid JSON'}`)
  }
}
