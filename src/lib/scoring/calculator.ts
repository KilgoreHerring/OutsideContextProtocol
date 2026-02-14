import { getClient } from '../ai/client'
import { finalReportSystem, finalReportUser } from '../ai/prompts'
import type { Session, FinalScore } from '@/types/session'
import type { Exercise } from '@/types/exercise'

function parseAIJson(text: string): unknown {
  let cleaned = text.trim()
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '')
  }
  return JSON.parse(cleaned)
}

export async function calculateFinalScore(
  session: Session,
  exercise: Exercise
): Promise<FinalScore> {
  const gradedSteps = session.stepResults
    .filter((r) => r.grade !== null)
    .map((r) => {
      const step = exercise.steps.find((s) => s.id === r.stepId)!
      return {
        stepId: r.stepId,
        title: step.title,
        score: r.grade!.score,
        maxScore: r.grade!.maxScore,
        feedback: r.grade!.feedback,
      }
    })

  const totalScore = gradedSteps.reduce((sum, s) => sum + s.score, 0)
  const totalMax = gradedSteps.reduce((sum, s) => sum + s.maxScore, 0)
  const overall = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0

  const useful = session.questionScores.filter(
    (q) => q.rating === 'useful'
  ).length
  const notUseful = session.questionScores.filter(
    (q) => q.rating === 'not-useful'
  ).length
  const total = useful + notUseful
  const ratio = total > 0 ? useful / total : 1

  // Get AI-generated narrative assessment
  const client = getClient()
  const response = await client.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 2048,
    system: finalReportSystem,
    messages: [
      {
        role: 'user',
        content: finalReportUser(
          exercise.title,
          gradedSteps.map((s) => ({
            title: s.title,
            score: s.score,
            maxScore: s.maxScore,
            feedback: s.feedback,
          })),
          { useful, notUseful }
        ),
      },
    ],
  })

  const content = response.content[0]
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude')
  }

  const narrative = parseAIJson(content.text) as {
    overallFeedback: string
    strengths: string[]
    areasForDevelopment: string[]
  }

  return {
    overall,
    stepScores: gradedSteps.map((s) => ({
      stepId: s.stepId,
      score: s.score,
      maxScore: s.maxScore,
    })),
    questionQuality: { useful, notUseful, ratio },
    strengths: narrative.strengths,
    areasForDevelopment: narrative.areasForDevelopment,
    overallFeedback: narrative.overallFeedback,
  }
}
