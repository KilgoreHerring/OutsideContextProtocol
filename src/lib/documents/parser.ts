import { parseDocx } from './docx-parser'
import { parsePdf } from './pdf-parser'

export async function extractText(
  buffer: Buffer,
  mimeType: string
): Promise<string> {
  if (
    mimeType ===
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    return parseDocx(buffer)
  }

  if (mimeType === 'application/pdf') {
    return parsePdf(buffer)
  }

  if (mimeType.startsWith('text/')) {
    return buffer.toString('utf-8')
  }

  throw new Error(`Unsupported file type: ${mimeType}`)
}

export function getMimeType(filename: string): string {
  const ext = filename.toLowerCase().split('.').pop()
  switch (ext) {
    case 'docx':
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    case 'pdf':
      return 'application/pdf'
    case 'txt':
      return 'text/plain'
    case 'md':
      return 'text/markdown'
    default:
      return 'application/octet-stream'
  }
}
