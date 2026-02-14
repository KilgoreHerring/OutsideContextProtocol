export interface StepGrade {
  score: number
  maxScore: number
  feedback: string
  strengths: string[]
  improvements: string[]
  criticalIssues: string[]
}

export interface StepResult {
  stepId: string
  submission: string | null
  grade: StepGrade | null
  submittedAt: string | null
}

export interface ChatMessage {
  id: string
  role: 'trainee' | 'supervisor'
  content: string
  stepId: string
  timestamp: string
}

export interface QuestionScore {
  messageId: string
  rating: 'useful' | 'not-useful'
  reasoning: string
}

export interface FinalScore {
  overall: number
  stepScores: { stepId: string; score: number; maxScore: number }[]
  questionQuality: { useful: number; notUseful: number; ratio: number }
  strengths: string[]
  areasForDevelopment: string[]
  overallFeedback: string
}

export interface Session {
  id: string
  exerciseId: string
  traineeName: string
  currentStepIndex: number
  status: 'in-progress' | 'completed' | 'abandoned'
  stepResults: StepResult[]
  chatHistory: ChatMessage[]
  questionScores: QuestionScore[]
  finalScore: FinalScore | null
  startedAt: string
  lastActivityAt: string
  completedAt: string | null
}
