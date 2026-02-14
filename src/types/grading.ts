export interface GradingRequest {
  traineeSubmission: string
  idealOutput: string
  gradingCriteria: string[]
  rubric: {
    overallApproach: string
    keyIssues: string[]
    criticalErrors: string[]
    qualityMarkers: string[]
  }
  stepContext: {
    title: string
    instruction: string
    type: string
  }
}

export interface GradingResponse {
  score: number
  feedback: string
  strengths: string[]
  improvements: string[]
  criticalIssues: string[]
}

export interface QuestionAssessmentRequest {
  question: string
  exerciseContext: string
  currentStepContext: string
  relevanceGuidance: string
  previousQuestions: string[]
}

export interface QuestionAssessmentResponse {
  rating: 'useful' | 'not-useful'
  reasoning: string
}
