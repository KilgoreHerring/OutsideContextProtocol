import { getClient } from './client'
import { gradingSystem, gradingUser } from './prompts'
import type { GradingResponse } from '@/types/grading'
import type { ExerciseStep, GradingRubric } from '@/types/exercise'

function parseAIJson(text: string): unknown {
  let cleaned = text.trim()
  // Strip markdown code fences
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '')
  }
  // If response starts with non-JSON, try to extract the JSON object
  if (!cleaned.startsWith('{') && !cleaned.startsWith('[')) {
    const match = cleaned.match(/\{[\s\S]*\}/)
    if (match) cleaned = match[0]
  }
  try {
    return JSON.parse(cleaned)
  } catch (e) {
    // Try fixing common issues: trailing commas, unescaped newlines in strings
    const fixedTrailingCommas = cleaned.replace(/,\s*([}\]])/g, '$1')
    try {
      return JSON.parse(fixedTrailingCommas)
    } catch {
      throw new Error(`Failed to parse AI response as JSON: ${cleaned.slice(0, 200)}...`)
    }
  }
}

export async function gradeSubmission(
  step: ExerciseStep,
  rubric: GradingRubric,
  traineeSubmission: string
): Promise<GradingResponse> {
  if (!step.idealOutput) {
    throw new Error('Cannot grade a step without an ideal output')
  }

  const client = getClient()

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20250929',
    max_tokens: 2048,
    system: gradingSystem,
    messages: [
      {
        role: 'user',
        content: gradingUser(
          step.title,
          step.instruction,
          step.type,
          step.gradingCriteria,
          step.idealOutput,
          traineeSubmission,
          {
            overallApproach: rubric.overallApproach,
            keyIssues: rubric.keyIssues,
            criticalErrors: rubric.criticalErrors,
            qualityMarkers: rubric.qualityMarkers,
          },
          step.maxScore
        ),
      },
    ],
  })

  const content = response.content[0]
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude')
  }

  const result = parseAIJson(content.text) as GradingResponse
  // Clamp score to valid range
  result.score = Math.max(0, Math.min(step.maxScore, Math.round(result.score)))
  return result
}
