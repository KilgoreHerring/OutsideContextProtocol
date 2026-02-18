import { NextResponse } from 'next/server'
import { getSession, getSessionOwnerId, saveSession } from '@/lib/storage/sessions'
import { getExercise } from '@/lib/storage/exercises'
import { getChatResponse } from '@/lib/ai/chat-responder'
import { assessQuestion } from '@/lib/ai/question-assessor'
import { requireAuth } from '@/lib/auth-helpers'
import type { ChatMessage, QuestionScore } from '@/types/session'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const authResult = await requireAuth()
  if (authResult instanceof NextResponse) return authResult
  const userId = authResult

  const { sessionId } = await params
  const session = await getSession(sessionId)
  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 })
  }

  const ownerId = await getSessionOwnerId(sessionId)
  if (ownerId !== null && ownerId !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const exercise = await getExercise(session.exerciseId)
  if (!exercise) {
    return NextResponse.json({ error: 'Exercise not found' }, { status: 404 })
  }

  const body = await request.json()
  const { message, stepId } = body

  if (!message || message.trim().length === 0) {
    return NextResponse.json(
      { error: 'Message cannot be empty' },
      { status: 400 }
    )
  }

  const currentStep =
    exercise.steps.find((s) => s.id === stepId) ||
    exercise.steps[session.currentStepIndex]

  // Add trainee message
  const traineeMsg: ChatMessage = {
    id: crypto.randomUUID(),
    role: 'trainee',
    content: message,
    stepId: currentStep.id,
    timestamp: new Date().toISOString(),
  }
  session.chatHistory.push(traineeMsg)

  // Fire both AI calls in parallel
  const previousQuestions = session.chatHistory
    .filter((m) => m.role === 'trainee')
    .map((m) => m.content)

  const [responseText, assessment] = await Promise.all([
    getChatResponse(
      exercise.rubric,
      currentStep,
      session.chatHistory,
      message
    ),
    assessQuestion(
      message,
      `${exercise.title} - ${exercise.matterType}: ${exercise.description}`,
      `${currentStep.title}: ${currentStep.instruction}`,
      exercise.rubric.questionRelevanceGuidance,
      previousQuestions.slice(0, -1) // exclude the current question
    ),
  ])

  // Add supervisor response
  const supervisorMsg: ChatMessage = {
    id: crypto.randomUUID(),
    role: 'supervisor',
    content: responseText,
    stepId: currentStep.id,
    timestamp: new Date().toISOString(),
  }
  session.chatHistory.push(supervisorMsg)

  // Record question score
  const questionScore: QuestionScore = {
    messageId: traineeMsg.id,
    rating: assessment.rating,
    reasoning: assessment.reasoning,
  }
  session.questionScores.push(questionScore)

  session.lastActivityAt = new Date().toISOString()
  await saveSession(session, userId)

  return NextResponse.json({
    reply: supervisorMsg,
    questionScore,
  })
}
