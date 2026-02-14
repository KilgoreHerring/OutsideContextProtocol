export type DocumentRole =
  | 'instruction'
  | 'source-material'
  | 'ideal-output'
  | 'correspondence'
  | 'feedback'
  | 'reference'

export interface UploadedDocument {
  id: string
  exerciseId: string
  filename: string
  mimeType: string
  role: DocumentRole
  label: string
  extractedText: string
  uploadedAt: string
}
