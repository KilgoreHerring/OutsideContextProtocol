import type { UploadedDocument } from './document'

export type StepType = 'read' | 'draft' | 'email' | 'review' | 'identify' | 'advise'

export interface ExerciseStep {
  id: string
  order: number
  title: string
  instruction: string
  type: StepType
  visibleDocuments: string[]
  idealOutput: string | null
  gradingCriteria: string[]
  maxScore: number
}

export interface GradingRubric {
  exerciseId: string
  overallApproach: string
  keyIssues: string[]
  criticalErrors: string[]
  qualityMarkers: string[]
  questionRelevanceGuidance: string
}

export interface Exercise {
  id: string
  title: string
  description: string
  matterType: string
  difficulty: 'junior' | 'mid' | 'senior'
  estimatedDurationMinutes: number
  documents: UploadedDocument[]
  steps: ExerciseStep[]
  rubric: GradingRubric
  generatedMarkdown: string
  status: 'draft' | 'generating' | 'ready'
  createdAt: string
  updatedAt: string
}
