import { DocumentType, ReviewDecision } from '../types';

export interface ValidationRuleResult {
  valid: boolean;
  errors: string[];
}

export function validateDocumentFile(file: File): { valid: boolean; error?: string } {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
  const maxSizeBytes = 10 * 1024 * 1024; // 10MB limit

  if (!allowedMimeTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file format: ${file.type || 'unknown'}. Permitted formats: JPEG, PNG, WEBP, PDF.`
    };
  }

  if (file.size > maxSizeBytes) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File size exceeds 10MB limit (${sizeMb}MB). Please upload an optimized scan or image.`
    };
  }

  // Basic filename safety check (prevent path traversal / malicious patterns)
  if (/[\\/:*?"<>|]/.test(file.name)) {
    return {
      valid: false,
      error: 'File name contains prohibited system characters. Please rename the file.'
    };
  }

  return { valid: true };
}

export function validateOfficerReviewSubmission(review: {
  decision?: ReviewDecision;
  notes?: string;
}): { valid: boolean; error?: string } {
  if (!review.decision) {
    return { valid: false, error: 'A definitive screening recommendation decision is required.' };
  }

  if (review.decision !== 'CLEAR' && (!review.notes || review.notes.trim().length < 8)) {
    return {
      valid: false,
      error: 'Officer notes (minimum 8 characters) are mandatory when issuing Review Required or Escalate.'
    };
  }

  return { valid: true };
}

export function sanitizeInputString(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, 1000);
}
