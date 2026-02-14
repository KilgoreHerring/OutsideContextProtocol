'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { DocumentRole, UploadedDocument } from '@/types/document'

type WizardStep = 'metadata' | 'documents' | 'generate'

const DOCUMENT_ROLES: { value: DocumentRole; label: string; description: string }[] = [
  { value: 'instruction', label: 'Instruction / Brief', description: 'Client email, partner instruction — given to trainee' },
  { value: 'source-material', label: 'Source Material', description: 'Original document trainee will work on — given to trainee' },
  { value: 'ideal-output', label: 'Ideal Output', description: 'The "perfect" final version — used for grading only' },
  { value: 'correspondence', label: 'Correspondence', description: 'Outgoing emails, cover letters — used for grading' },
  { value: 'feedback', label: 'Feedback Notes', description: 'Supervisor feedback from the real matter' },
  { value: 'reference', label: 'Reference Material', description: 'Supplementary documents' },
]

export default function NewExercise() {
  const router = useRouter()
  const [step, setStep] = useState<WizardStep>('metadata')
  const [exerciseId, setExerciseId] = useState<string | null>(null)

  // Metadata
  const [title, setTitle] = useState('')
  const [matterType, setMatterType] = useState('')
  const [description, setDescription] = useState('')
  const [difficulty, setDifficulty] = useState<'junior' | 'mid' | 'senior'>('junior')
  const [duration, setDuration] = useState(480)

  // Documents
  const [documents, setDocuments] = useState<UploadedDocument[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadRole, setUploadRole] = useState<DocumentRole>('instruction')
  const [uploadLabel, setUploadLabel] = useState('')

  // Generate
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')

  async function handleCreateExercise() {
    setError('')
    const res = await fetch('/api/exercises', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, matterType, description, difficulty, estimatedDurationMinutes: duration }),
    })
    if (!res.ok) {
      setError('Failed to create exercise')
      return
    }
    const exercise = await res.json()
    setExerciseId(exercise.id)
    setStep('documents')
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || !exerciseId) return
    setUploading(true)
    setError('')

    for (const file of Array.from(e.target.files)) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('role', uploadRole)
      formData.append('label', uploadLabel || file.name)

      const res = await fetch(`/api/exercises/${exerciseId}/upload`, {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Upload failed')
      } else {
        const doc = await res.json()
        setDocuments((prev) => [...prev, doc])
      }
    }

    setUploading(false)
    setUploadLabel('')
    e.target.value = ''
  }

  async function handleGenerate() {
    if (!exerciseId) return
    setGenerating(true)
    setError('')

    const res = await fetch(`/api/exercises/${exerciseId}/generate`, {
      method: 'POST',
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || 'Generation failed')
      setGenerating(false)
      return
    }

    router.push(`/exercises/${exerciseId}`)
  }

  return (
    <div className="container" style={{ maxWidth: '720px' }}>
      <h1 style={{ marginBottom: '0.5rem' }}>New Exercise</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Create a training exercise from real matter documents.
      </p>

      {/* Progress */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
        {(['metadata', 'documents', 'generate'] as WizardStep[]).map((s, i) => (
          <div
            key={s}
            style={{
              flex: 1,
              height: '4px',
              borderRadius: '2px',
              background: i <= ['metadata', 'documents', 'generate'].indexOf(step) ? 'var(--primary)' : 'var(--border)',
              transition: 'background 0.3s',
            }}
          />
        ))}
      </div>

      {error && (
        <div style={{
          padding: '0.75rem 1rem',
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: 'var(--radius-sm)',
          color: 'var(--danger)',
          fontSize: '0.875rem',
          marginBottom: '1.5rem',
        }}>
          {error}
        </div>
      )}

      {/* Step 1: Metadata */}
      {step === 'metadata' && (
        <div className="card" style={{ padding: '1.5rem' }}>
          <h2 style={{ marginBottom: '1.25rem' }}>Exercise Details</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label>Title</label>
              <input
                className="form-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Client T&C Redraft Exercise"
              />
            </div>

            <div className="form-group">
              <label>Matter Type</label>
              <input
                className="form-input"
                value={matterType}
                onChange={(e) => setMatterType(e.target.value)}
                placeholder="e.g. T&C Redraft, Share Purchase Agreement, Lease Review"
              />
            </div>

            <div className="form-group">
              <label>Description (optional)</label>
              <textarea
                className="form-input"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the exercise scenario..."
                rows={3}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Difficulty</label>
                <select
                  className="form-input"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as 'junior' | 'mid' | 'senior')}
                >
                  <option value="junior">Junior (0-2 PQE)</option>
                  <option value="mid">Mid (2-4 PQE)</option>
                  <option value="senior">Senior (4+ PQE)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Estimated Duration (minutes)</label>
                <input
                  className="form-input"
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value) || 480)}
                  min={30}
                  max={960}
                />
              </div>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              className="btn btn-primary"
              disabled={!title.trim() || !matterType.trim()}
              onClick={handleCreateExercise}
            >
              Next: Upload Documents
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Documents */}
      {step === 'documents' && (
        <div className="card" style={{ padding: '1.5rem' }}>
          <h2 style={{ marginBottom: '0.5rem' }}>Upload Documents</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
            Upload the matter documents. Label each with its role so the system knows which are for the trainee and which define the &quot;correct&quot; answer.
          </p>

          {/* Upload form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', padding: '1rem', background: 'var(--bg)', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label>Document Role</label>
                <select
                  className="form-input"
                  value={uploadRole}
                  onChange={(e) => setUploadRole(e.target.value as DocumentRole)}
                >
                  {DOCUMENT_ROLES.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {DOCUMENT_ROLES.find((r) => r.value === uploadRole)?.description}
                </span>
              </div>

              <div className="form-group">
                <label>Label (optional)</label>
                <input
                  className="form-input"
                  value={uploadLabel}
                  onChange={(e) => setUploadLabel(e.target.value)}
                  placeholder="e.g. Original T&Cs, Client Instruction Email"
                />
              </div>
            </div>

            <div>
              <input
                type="file"
                accept=".docx,.pdf,.txt,.md"
                multiple
                onChange={handleFileUpload}
                disabled={uploading}
                style={{ fontSize: '0.875rem' }}
              />
              {uploading && <span className="spinner" style={{ marginLeft: '0.5rem' }} />}
            </div>
          </div>

          {/* Uploaded documents list */}
          {documents.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ marginBottom: '0.75rem' }}>Uploaded Documents ({documents.length})</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.625rem 0.75rem',
                      background: 'var(--bg)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.875rem',
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: 500 }}>{doc.label}</span>
                      <span style={{ color: 'var(--text-muted)', marginLeft: '0.5rem' }}>({doc.filename})</span>
                    </div>
                    <span className={`badge ${doc.role === 'ideal-output' || doc.role === 'correspondence' ? 'badge-warning' : 'badge-success'}`}>
                      {DOCUMENT_ROLES.find((r) => r.value === doc.role)?.label || doc.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button className="btn" onClick={() => setStep('metadata')}>Back</button>
            <button
              className="btn btn-primary"
              disabled={documents.length === 0}
              onClick={() => setStep('generate')}
            >
              Next: Generate Exercise
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Generate */}
      {step === 'generate' && (
        <div className="card" style={{ padding: '1.5rem' }}>
          <h2 style={{ marginBottom: '0.5rem' }}>Generate Exercise</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            The AI will analyse your uploaded documents and create a structured training exercise with steps, grading criteria, and a rubric.
          </p>

          <div style={{ padding: '1rem', background: 'var(--bg)', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.875rem' }}>
              <div><strong>Title:</strong> {title}</div>
              <div><strong>Type:</strong> {matterType}</div>
              <div><strong>Documents:</strong> {documents.length}</div>
              <div style={{ marginTop: '0.5rem' }}>
                {documents.map((d) => (
                  <div key={d.id} style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>
                    &bull; {d.label} ({DOCUMENT_ROLES.find((r) => r.value === d.role)?.label})
                  </div>
                ))}
              </div>
            </div>
          </div>

          {generating ? (
            <div className="loading-overlay">
              <div className="spinner" />
              <span>Generating exercise... This may take 30-60 seconds.</span>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button className="btn" onClick={() => setStep('documents')}>Back</button>
              <button className="btn btn-primary btn-lg" onClick={handleGenerate}>
                Generate Exercise
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
